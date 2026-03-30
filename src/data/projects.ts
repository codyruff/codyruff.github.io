export type Project = {
  id: string;
  title: string;
  description: string;
  role?: string;           // Optional highlighted role badge
  tags: string[];
  github?: string;         // Optional GitHub link
  live?: string;           // Optional live site link
  featured: boolean;       // Featured = larger card
  accentColor?: string;    // Optional per-card accent override
};

export const projects: Project[] = [
  {
    id: "aws-data-logger",
    title: "AWS Data Events Logger",
    description:
      "A tool that logs data events on a specific S3 bucket and estimates the cost of tracking that bucket. Built with serverless architecture using AWS Lambda and automated infrastructure via CloudFormation.",
    tags: ["Python", "AWS Lambda", "S3", "Boto3", "CloudFormation", "YAML"],
    github: "https://github.com/codyruff",
    featured: true,
    accentColor: "#B8962E", // gold — flagship project
  },
  {
    id: "qualitative-coding-app",
    title: "Qualitative Coding App",
    description:
      "Capstone project — a full-stack application for qualitative data coding. Built React user interfaces and served as Frontend Security Liaison, ensuring secure data handling and proper integration between client and backend systems.",
    role: "Frontend Security Liaison",
    tags: ["React", "Next.js", "JavaScript", "Security", "Frontend"],
    featured: false,
    accentColor: "#7A9E7E", // sage — security/liaison role
  },
];