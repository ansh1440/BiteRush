package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.RefundEntity;

public interface RefundService {
    RefundEntity initiateRefund(Long orderId, String refundReason);
    RefundEntity processRefund(Long refundId);
    RefundEntity getRefundByOrderId(Long orderId);
}