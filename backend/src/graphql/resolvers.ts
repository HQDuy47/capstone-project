import userResolver from "./user/user.resolver";
import job_applyResolver from "./job/job_apply.resolver";
import companyResolver from "./company/company.resolver";
import company_reviewResolver from "./company/company_review.resolver";
import search_jobResolver from "./job/search_job.resolver";
import blogResolver from "./blog/blog.resolver";
import jobResolver from "./job/job.resolver";
import search_companyResolver from "./company/search_company.resolver";

export default [
  userResolver,
  jobResolver,
  search_jobResolver,
  job_applyResolver,
  companyResolver,
  company_reviewResolver,
  search_companyResolver,
  blogResolver,
  jobResolver,
];
