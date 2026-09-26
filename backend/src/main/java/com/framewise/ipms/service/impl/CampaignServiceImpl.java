package com.framewise.ipms.service.impl;

import com.framewise.ipms.dto.request.CampaignRequest;
import com.framewise.ipms.dto.response.CampaignResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.Campaign;
import com.framewise.ipms.entity.CampaignStatus;
import com.framewise.ipms.entity.Client;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.exception.ResourceNotFoundException;
import com.framewise.ipms.exception.ValidationException;
import com.framewise.ipms.mapper.CampaignMapper;
import com.framewise.ipms.repository.CampaignRepository;
import com.framewise.ipms.repository.ClientRepository;
import com.framewise.ipms.repository.UserRepository;
import com.framewise.ipms.service.CampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final CampaignMapper campaignMapper;

    @Override
    @Transactional
    public CampaignResponse create(
            CampaignRequest request,
            Long createdById) {

        validateDateRange(request);

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Client not found with id: "
                                        + request.getClientId()));

        User creator = userRepository.findById(createdById)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: "
                                        + createdById));

        Campaign campaign = campaignMapper.toEntity(request);

        campaign.setClient(client);
        campaign.setCreatedBy(creator);

        campaignRepository.save(campaign);

        log.info(
                "Campaign created: id={}, client={}",
                campaign.getCampaignId(),
                client.getClientId()
        );

        return campaignMapper.toResponse(campaign);
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignResponse getById(Long campaignId) {

        Campaign campaign = findById(campaignId);

        return campaignMapper.toResponse(campaign);
    }

    @Override
    @Transactional
    public CampaignResponse update(
            Long campaignId,
            CampaignRequest request) {

        validateDateRange(request);

        Campaign campaign = findById(campaignId);

        if (request.getClientId() != null
                && !campaign.getClient().getClientId()
                .equals(request.getClientId())) {

            Client client = clientRepository
                    .findById(request.getClientId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Client not found with id: "
                                            + request.getClientId()));

            campaign.setClient(client);
        }

        campaignMapper.updateEntity(request, campaign);

        campaignRepository.save(campaign);

        log.info(
                "Campaign updated: id={}",
                campaignId
        );

        return campaignMapper.toResponse(campaign);
    }

    @Override
    @Transactional
    public void delete(Long campaignId) {

        Campaign campaign = findById(campaignId);

        campaign.setStatus(CampaignStatus.CANCELLED);

        campaignRepository.save(campaign);

        log.info(
                "Campaign cancelled (soft-delete): id={}",
                campaignId
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CampaignResponse> search(
            String keyword,
            CampaignStatus status,
            Long clientId,
            Pageable pageable) {

        Page<Campaign> campaignPage =
                campaignRepository.search(
                        keyword,
                        status,
                        clientId,
                        pageable
                );

        Page<CampaignResponse> responsePage =
                campaignPage.map(campaignMapper::toResponse);

        return PageResponse.of(responsePage);
    }

    private Campaign findById(Long campaignId) {

        return campaignRepository.findById(campaignId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Campaign not found with id: "
                                        + campaignId));
    }

    private void validateDateRange(
            CampaignRequest request) {

        if (request.getStartDate() != null
                && request.getEndDate() != null
                && request.getEndDate()
                .isBefore(request.getStartDate())) {

            throw new ValidationException(
                    "End date must not be before start date"
            );
        }
    }
}