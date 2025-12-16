// Enum for Likert Scale values
export enum LikertValue {
  UNSELECTED = 0,
  STRONGLY_DISAGREE = 1,
  DISAGREE = 2,
  NEUTRAL = 3,
  AGREE = 4,
  STRONGLY_AGREE = 5,
}

// Section A: Organization Context
export interface ContextData {
  companySize: string;
  role: string;
  industry: string;
  industryOther: string; // Added for the conditional field
}

// Generic structure for Sections B-G
export interface DimensionData {
  q1: LikertValue;
  q2: LikertValue;
  q3: LikertValue;
  comments: string;
}

// Contact Section
export interface ContactData {
  email: string;
}

// The main state object
export interface SurveyData {
  context: ContextData;
  strategy: DimensionData;
  useCases: DimensionData;
  organization: DimensionData;
  competencies: DimensionData;
  technology: DimensionData;
  governance: DimensionData;
  contact: ContactData;
}

// Structure for mapping questions in the UI
export interface QuestionDefinition {
  id: 'q1' | 'q2' | 'q3';
  text: string;
}

export interface SectionDefinition {
  key: keyof SurveyData; // maps to the state key
  title: string;
  description?: string; // Intro text for the section
  questions?: QuestionDefinition[]; // Only for Likert sections
  freetextQuestion?: string; // Specific prompt for the text area
}