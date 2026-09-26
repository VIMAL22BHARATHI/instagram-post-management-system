package com.framewise.ipms.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Transparently encrypts/decrypts the access_token column using AES-256-CBC.
 * Key is sourced from env var APP_ENCRYPTION_KEY (exactly 32 UTF-8 chars).
 * Stored format: base64(iv):base64(ciphertext) — IV is unique per write.
 */
@Converter
@Component
public class AesEncryptionConverter implements AttributeConverter<String, String> {

    private static final String CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String KEY_ALGORITHM = "AES";
    private static final int IV_BYTES = 16;

    private final byte[] keyBytes;

    public AesEncryptionConverter(
            @Value("${app.encryption.key}") String rawKey) {

        byte[] bytes = rawKey.getBytes(StandardCharsets.UTF_8);

        if (bytes.length != 32) {
            throw new IllegalArgumentException(
                    "app.encryption.key must be exactly 32 characters"
            );
        }

        this.keyBytes = bytes;
    }

    @Override
    public String convertToDatabaseColumn(String plaintext) {

        if (plaintext == null) {
            return null;
        }

        try {
            byte[] iv = generateIv();

            byte[] encrypted = runCipher(
                    Cipher.ENCRYPT_MODE,
                    iv,
                    plaintext.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(iv)
                    + ":"
                    + Base64.getEncoder().encodeToString(encrypted);

        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(
                    "Encryption failed",
                    e
            );
        }
    }

    @Override
    public String convertToEntityAttribute(String ciphertext) {

        if (ciphertext == null) {
            return null;
        }

        try {
            String[] parts = ciphertext.split(":", 2);

            if (parts.length < 2) {
                return ciphertext;
            }

            byte[] iv = Base64.getDecoder().decode(parts[0]);

            byte[] encrypted = Base64.getDecoder().decode(parts[1]);

            byte[] decrypted = runCipher(
                    Cipher.DECRYPT_MODE,
                    iv,
                    encrypted
            );

            return new String(
                    decrypted,
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {

            System.err.println(
                    "Decryption failed for ciphertext, "
                            + "returning raw value: "
                            + e.getMessage()
            );

            return ciphertext;
        }
    }

    private byte[] runCipher(
            int mode,
            byte[] iv,
            byte[] data
    ) throws GeneralSecurityException {

        SecretKeySpec key = new SecretKeySpec(
                keyBytes,
                KEY_ALGORITHM
        );

        Cipher cipher = Cipher.getInstance(
                CIPHER_ALGORITHM
        );

        cipher.init(
                mode,
                key,
                new IvParameterSpec(iv)
        );

        return cipher.doFinal(data);
    }

    private byte[] generateIv() {

        byte[] iv = new byte[IV_BYTES];

        SecureRandom secureRandom = new SecureRandom();

        secureRandom.nextBytes(iv);

        return iv;
    }
}