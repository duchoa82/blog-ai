// Shared data for business description and target customer
export interface SharedData {
  businessDescription: string;
  targetCustomer: string;
}

// Default values
export const defaultSharedData: SharedData = {
  businessDescription: "Premium cotton t-shirts and sustainable fashion for eco-conscious consumers. We specialize in comfortable, high-quality clothing made from organic materials.",
  targetCustomer: "Young professionals aged 25-40 who value sustainability, comfort, and style. They are environmentally conscious and willing to invest in quality clothing that aligns with their values."
};

// Local storage keys
const BUSINESS_DESCRIPTION_KEY = "businessDescription";
const TARGET_CUSTOMER_KEY = "targetCustomer";

// Helper functions to get and set data from localStorage
export const getBusinessDescription = (): string => {
  return localStorage.getItem(BUSINESS_DESCRIPTION_KEY) || defaultSharedData.businessDescription;
};

export const setBusinessDescription = (description: string): void => {
  localStorage.setItem(BUSINESS_DESCRIPTION_KEY, description);
};

export const getTargetCustomer = (): string => {
  return localStorage.getItem(TARGET_CUSTOMER_KEY) || defaultSharedData.targetCustomer;
};

export const setTargetCustomer = (customer: string): void => {
  localStorage.setItem(TARGET_CUSTOMER_KEY, customer);
};

export const getSharedData = (): SharedData => {
  return {
    businessDescription: getBusinessDescription(),
    targetCustomer: getTargetCustomer()
  };
};

export const setSharedData = (data: Partial<SharedData>): void => {
  if (data.businessDescription !== undefined) {
    setBusinessDescription(data.businessDescription);
  }
  if (data.targetCustomer !== undefined) {
    setTargetCustomer(data.targetCustomer);
  }
}; 