package com.framewise.ipms.service.impl;

import com.framewise.ipms.dto.request.*;
import com.framewise.ipms.dto.response.AuthResponse;
import com.framewise.ipms.entity.PasswordResetToken;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.exception.ResourceNotFoundException;
import com.framewise.ipms.exception.ValidationException;
import com.framewise.ipms.repository.PasswordResetTokenRepository;
import com.framewise.ipms.repository.UserRepository;
import com.framewise.ipms.security.jwt.JwtService;
import com.framewise.ipms.service.AuthService;
import com.framewise.ipms.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int RESET_TOKEN_EXPIRY_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Sprint 1 logic preserved — gating added here
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.framewise.ipms.exception.DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());

        user.setActive(true);

        userRepository.save(user);
        log.info("User registered: {} | role: {} | active: {}", user.getEmail(), user.getRole(), user.isActive());

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return AuthResponse.of(accessToken, refreshToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return AuthResponse.of(accessToken, refreshToken);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        // Sprint 1 — delegate to JwtService
        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new com.framewise.ipms.exception.UnauthorizedException("Invalid refresh token");
        }
        return AuthResponse.of(jwtService.generateAccessToken(user), refreshToken);
    }

    @Override
    public void logout(String refreshToken) {
        jwtService.invalidateToken(refreshToken);
    }

    // -------------------------------------------------------------------------
    // Sprint 2.1
    // -------------------------------------------------------------------------

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            // Invalidate any existing tokens for this user
            passwordResetTokenRepository.deleteAllByUserId(user.getId());

            String rawToken = UUID.randomUUID().toString();
            PasswordResetToken prt = new PasswordResetToken(
                    rawToken, user, LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES));
            passwordResetTokenRepository.save(prt);

            mailService.sendPasswordResetEmail(user.getEmail(), rawToken);
        });
        // Always return silently — do not reveal whether the email exists
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        PasswordResetToken prt = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ValidationException("Invalid or expired reset token"));

        if (prt.isUsed() || prt.isExpired()) {
            throw new ValidationException("Invalid or expired reset token");
        }

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);

        log.info("Password reset successfully for user {}", user.getEmail());
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ValidationException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed for user {}", user.getEmail());
    }
}
