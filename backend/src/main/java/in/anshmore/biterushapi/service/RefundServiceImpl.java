package in.anshmore.biterushapi.service;

import in.anshmore.biterushapi.entity.OrderEntity;
import in.anshmore.biterushapi.entity.RefundEntity;
import in.anshmore.biterushapi.repository.OrderRepository;
import in.anshmore.biterushapi.repository.RefundRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RefundServiceImpl implements RefundService {

    @Autowired
    private RefundRepository refundRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public RefundEntity initiateRefund(Long orderId, String refundReason) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        RefundEntity refund = RefundEntity.builder()
                .orderId(orderId)
                .userId(order.getUserId())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .refundAmount(order.getAmount())
                .refundReason(refundReason)
                .refundStatus("PENDING")
                .build();
        
        RefundEntity savedRefund = refundRepository.save(refund);
        log.info("Refund initiated for order {} with amount {}", orderId, order.getAmount());
        return savedRefund;
    }

    @Override
    public RefundEntity processRefund(Long refundId) {
        RefundEntity refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund not found"));
        
        refund.setRefundStatus("PROCESSED");
        return refundRepository.save(refund);
    }

    @Override
    public RefundEntity getRefundByOrderId(Long orderId) {
        return refundRepository.findByOrderId(orderId).orElse(null);
    }
}