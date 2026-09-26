package com.framewise.ipms.config;

import com.framewise.ipms.entity.*;
import com.framewise.ipms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Development-only initializer. Enabled when Spring profile 'dev' is active.
 * Inserts a small set of test data if the tables are empty.
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevDataInitializer implements org.springframework.boot.CommandLineRunner {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final InstagramAccountRepository instagramAccountRepository;
    private final ContentItemRepository contentItemRepository;
    private final ContentTemplateRepository contentTemplateRepository;
    private final CampaignRepository campaignRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding development data (dev profile)");

            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin User");
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);

            User manager = new User();
            manager.setEmail("manager@example.com");
            manager.setFullName("Account Manager");
            manager.setPassword(passwordEncoder.encode("Manager123!"));
            manager.setRole(Role.ACCOUNT_MANAGER);
            manager.setActive(true);
            userRepository.save(manager);

            Client client = new Client();
            client.setClientName("Acme Test Client");
            client.setContactEmail("client@example.com");
            client.setCompanyName("Acme Co.");
            client.setAccountManager(manager);
            client.setActive(true);
            clientRepository.save(client);

            InstagramAccount acct = new InstagramAccount();
            acct.setUsername("brand_test");
            acct.setInstagramId("17890000000000000");
            acct.setAccessToken("dev-token-placeholder");
            acct.setAccountType(AccountType.BUSINESS);
            acct.setOwner(manager);
            acct.setConnected(true);
            instagramAccountRepository.save(acct);

            ContentTemplate tpl = new ContentTemplate();
            tpl.setName("Promo Template");
            tpl.setBody("This is a seeded template. Use {{product}} in body.");
            tpl.setDescription("Seeded template");
            tpl.setCreatedBy(manager);
            tpl.setPublic(true);
            contentTemplateRepository.save(tpl);

            ContentItem item = new ContentItem();
            item.setTitle("Seeded Image");
            item.setDescription("Seeded placeholder media");
            item.setContentType(ContentType.IMAGE);
            item.setFilePath("seed://image.jpg");
            item.setOriginalFileName("image.jpg");
            item.setTag("seed");
            item.setUploadedBy(manager);
            item.setUsageCount(0L);
            item.setActive(true);
            contentItemRepository.save(item);

            Campaign campaign = new Campaign();
            campaign.setName("Seed Campaign");
            campaign.setDescription("Seeded campaign for testing");
            campaign.setStatus(CampaignStatus.DRAFT);
            campaign.setStartDate(LocalDate.now());
            campaign.setEndDate(LocalDate.now().plusDays(30));
            campaign.setClient(client);
            campaign.setCreatedBy(manager);
            campaignRepository.save(campaign);

            log.info("Development data seeded");
        } else {
            log.info("Development data not seeded: users exist (count={})", userRepository.count());
        }
    }
}
