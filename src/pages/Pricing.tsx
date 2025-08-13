import React, { useState } from 'react';
import {
  Page,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Icon,
  Divider
} from "@shopify/polaris";
import { CheckSmallIcon } from "@shopify/polaris-icons";

const Pricing = () => {
  const plans = [
    {
      name: "ENTERPRISE",
      price: "$79.99",
      originalPrice: "",
      discount: "",
      features: [
        "All Growth features",
        "1500 AI credits/month",
        "Blog publish scheduling",
        "Bulk schedule",
        "AI keyword suggestions",
        "No Tapita trademark"
      ],
      buttonText: "Choose Plan",
      buttonVariant: "primary" as const,
      hasDiscount: false
    },
    {
      name: "STARTER",
      price: "$7.99",
      originalPrice: "",
      discount: "",
      features: [
        "All Free features",
        "150 AI credits/month",
        "Blog publish scheduling",
        "AI keyword suggestions",
        "No Tapita trademark"
      ],
      buttonText: "Choose Plan",
      buttonVariant: "primary" as const,
      hasDiscount: false
    },
    {
      name: "FREE",
      price: "$0",
      originalPrice: "",
      discount: "",
      features: [
        "Unlimited blog posts",
        "50 AI credits (non-recurring)",
        "Multi-language AI content",
        "SEO audit",
        "24/7 live chat support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "plain" as const,
      hasDiscount: false,
      isCurrentPlan: true
    }
  ];

  return (
    <div className="pricing-page">
      <Page title="Choose the right plan for you">
        <BlockStack gap="800">

        {/* Pricing Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {plans.map((plan, index) => (
            <div key={plan.name} className="pricing-card" style={{ position: "relative" }}>
              {/* Discount Badge */}
              {plan.hasDiscount && (
                <div style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "#90EE90",
                  color: "#000000",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  zIndex: 1
                }}>
                  {plan.discount}
                </div>
              )}
              

              
              <div style={{ padding: "24px" }}>
                <BlockStack gap="400">
                  {/* Plan Header */}
                  <div>
                    <span className="pricing-plan-name">
                      {plan.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "flex-end", 
                      gap: "4px",
                      flexWrap: "nowrap"
                    }}>
                      <span 
                        className="pricing-price"
                        style={{ 
                          fontSize: "var(--p-font-size-750)",
                          fontWeight: "bold",
                          display: "block"
                        }}
                      >
                        {plan.price}
                      </span>
                      {(plan.name === "ENTERPRISE" || plan.name === "STARTER") && (
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "normal",
                          color: "#6d7175",
                          lineHeight: "1",
                          marginBottom: "2px"
                        }}>
                          /month
                        </span>
                      )}
                    </div>
                    {plan.originalPrice && (
                      <div style={{ marginTop: "8px" }}>
                        <span style={{ textDecoration: "line-through", color: "#6d7175" }}>
                          {plan.originalPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  {plan.buttonText && (
                    <Button
                      variant={plan.isCurrentPlan ? "secondary" : "primary"}
                      fullWidth
                      disabled={plan.isCurrentPlan}
                    >
                      {plan.buttonText}
                    </Button>
                  )}

                  {/* Features */}
                  <div>
                    <BlockStack gap="300">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} style={{ 
                          display: "flex", 
                          alignItems: "flex-start", 
                          gap: "12px", 
                          justifyContent: "flex-start",
                          minHeight: "24px"
                        }}>
                          <div style={{ 
                            flexShrink: 0, 
                            marginTop: "2px",
                            width: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <Icon 
                              source={CheckSmallIcon} 
                              tone="success"
                            />
                          </div>
                          <Text variant="bodyMd" as="span">
                            {feature}
                          </Text>
                        </div>
                      ))}
                    </BlockStack>
                  </div>
                </BlockStack>
              </div>
            </div>
          ))}
        </div>
      </BlockStack>

      {/* Chat Bubble */}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        backgroundColor: "#5c6ac4",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(92, 106, 196, 0.3)",
        zIndex: 1000
      }}>
        <div style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#5c6ac4"
        }}>
          💬
        </div>
      </div>
    </Page>
    </div>
  );
};

export default Pricing;
