package com.framewise.ipms.service;

public interface MailService {

    void sendPasswordResetEmail(String toEmail, String resetToken);
}
