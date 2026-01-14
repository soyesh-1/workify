# Workify Test Case Scenarios

This document follows the same structure as the reference test case PDF and is tailored to the Workify web application.

---

## Test Case ID: WF-TC-01
Tested By: Soyesh Shrestha  
Module Name (Test Title): User Sign-Up / Registration  
Test Executed Date: 10/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a new user can register using valid credentials.  
Context: Registration is required to access seeker/recruiter features.  

Precondition:
- User does not already have an account.
- Stable internet connection.

Dependency:
- Auth API
- Database

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open the Sign Up page | N/A | Sign Up page displays | As Expected | Pass | Signup screen opened |
| 2 | Enter valid username, email, password | sample@workify.com | Inputs accepted | As Expected | Pass | Inputs accepted |
| 3 | Select role (Seeker/Recruiter) | Seeker | Role selected | As Expected | Pass | Role selected |
| 4 | Submit the form | N/A | Account created; success message | As Expected | Pass | User registered |

Post Condition: User account is created and can log in.

---

## Test Case ID: WF-TC-02
Tested By: Soyesh Shrestha  
Module Name (Test Title): User Login  
Test Executed Date: 01/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a registered user can log in successfully.  
Context: Secure authentication is required for accessing the dashboard.  

Precondition:
- User has a registered account.
- Stable internet connection.

Dependency:
- Auth API
- Database

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open the Login page | N/A | Login page displays | As Expected | Pass | Login screen displayed |
| 2 | Enter valid email and password | sample@workify.com | Credentials accepted | As Expected | Pass | Credentials accepted |
| 3 | Click Login | N/A | Redirected to dashboard | As Expected | Pass | Successful login |

Post Condition: User is logged in and sees the dashboard.

---

## Test Case ID: WF-TC-03
Tested By: Soyesh Shrestha  
Module Name (Test Title): Profile Update  
Test Executed Date: 31/12/2025  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a user can update profile fields.  
Context: Profile details are visible to recruiters.  

Precondition:
- User is logged in.
- Profile page is accessible.

Dependency:
- Auth API
- Database

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Profile page | N/A | Profile page loads | As Expected | Pass | Profile loaded |
| 2 | Update phone/location/bio/skills | "9800000000" | Fields updated in form | As Expected | Pass | Profile fields updated |
| 3 | Save changes | N/A | Success message shown | As Expected | Pass | Changes saved |
| 4 | Refresh page | N/A | Updated data persists | As Expected | Pass | Data persisted |

Post Condition: Profile details are updated.

---

## Test Case ID: WF-TC-04
Tested By: Soyesh Shrestha  
Module Name (Test Title): Upload Profile Photo  
Test Executed Date: 04/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a user can upload and view a profile photo.  
Context: Profile photo is shown on applicant lists.  

Precondition:
- User is logged in.
- Profile page is accessible.

Dependency:
- Auth API
- File upload storage

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Profile page | N/A | Profile page loads | As Expected | Pass | Profile loaded |
| 2 | Select image file | avatar.png | File accepted | As Expected | Pass | Image selected |
| 3 | Upload photo | N/A | Success message shown | As Expected | Pass | Avatar uploaded |
| 4 | Verify avatar display | N/A | Avatar shows in profile | As Expected | Pass | Avatar visible |

Post Condition: Profile photo is stored and visible.

---

## Test Case ID: WF-TC-05
Tested By: Soyesh Shrestha  
Module Name (Test Title): Upload Resume (Profile)  
Test Executed Date: 03/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a user can upload a resume in profile.  
Context: Resume is required before applying to jobs.  

Precondition:
- User is logged in.
- Profile page is accessible.

Dependency:
- Auth API
- File upload storage

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Profile page | N/A | Profile page loads | As Expected | Pass | Profile loaded |
| 2 | Select resume file | resume.pdf | File accepted | As Expected | Pass | Resume selected |
| 3 | Upload resume | N/A | Success message shown | As Expected | Pass | Resume uploaded |
| 4 | Click View Resume | N/A | Resume opens in new tab | As Expected | Pass | Resume opened |

Post Condition: Resume is stored and viewable.

---

## Test Case ID: WF-TC-06
Tested By: Soyesh Shrestha  
Module Name (Test Title): Browse Jobs  
Test Executed Date: 03/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify jobs list loads for seekers.  
Context: Users need to explore available jobs.  

Precondition:
- User is logged in or browsing as guest.
- Jobs exist in database.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Browse Jobs | N/A | Jobs list loads | As Expected | Pass | Jobs loaded |
| 2 | Verify job cards | N/A | Title/company/location shown | As Expected | Pass | Job cards visible |

Post Condition: Jobs list is visible.

---

## Test Case ID: WF-TC-07
Tested By: Soyesh Shrestha  
Module Name (Test Title): Search and Filter Jobs  
Test Executed Date: 02/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify search and filter work correctly.  
Context: Users need to find relevant jobs quickly.  

Precondition:
- Jobs exist with varied titles/locations.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Enter keyword search | "Frontend" | Matching jobs shown | As Expected | Pass | Search results updated |
| 2 | Enter location filter | "Kathmandu" | Results filtered by location | As Expected | Pass | Filter applied |
| 3 | Clear filters | N/A | Full list returns | As Expected | Pass | Filters cleared |

Post Condition: Search and filter produce correct results.

---

## Test Case ID: WF-TC-08
Tested By: Soyesh Shrestha  
Module Name (Test Title): Save Job  
Test Executed Date: 01/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a seeker can save and remove saved jobs.  
Context: Saved jobs help users revisit opportunities.  

Precondition:
- User is logged in as seeker.
- Jobs list visible.

Dependency:
- Auth API
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click Save (bookmark) | N/A | Job saved; icon updates | As Expected | Pass | Job bookmarked |
| 2 | Open Saved Jobs page | N/A | Job appears in saved list | As Expected | Pass | Saved list loaded |
| 3 | Remove saved job | N/A | Job removed from list | As Expected | Pass | Job removed |

Post Condition: Saved job list reflects changes.

---

## Test Case ID: WF-TC-09
Tested By: Soyesh Shrestha  
Module Name (Test Title): Apply for Job (With Profile Resume)  
Test Executed Date: 10/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify application uses profile resume.  
Context: Applying should not require a new resume upload.  

Precondition:
- User is logged in as seeker.
- Profile has a resume uploaded.

Dependency:
- Jobs API
- Auth API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open job details | N/A | Job details modal opens | As Expected | Pass | Job modal opened |
| 2 | Click Apply Now | N/A | Application submitted; success message | As Expected | Pass | Application submitted |
| 3 | Refresh jobs list | N/A | Status shows pending/applied | As Expected | Pass | Status updated |

Post Condition: Application is created with profile resume.

---

## Test Case ID: WF-TC-10
Tested By: Soyesh Shrestha  
Module Name (Test Title): Block Apply Without Resume  
Test Executed Date: 08/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify apply is blocked if resume is missing.  
Context: Resume is required to apply.  

Precondition:
- User is logged in as seeker.
- Profile has no resume uploaded.

Dependency:
- Jobs API
- Auth API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click Apply Now | N/A | Prompt to upload resume | As Expected | Pass | Resume required message shown |
| 2 | Redirect to profile | N/A | Profile page opens | As Expected | Pass | Profile opened |

Post Condition: User cannot apply without resume.

---

## Test Case ID: WF-TC-11
Tested By: Soyesh Shrestha  
Module Name (Test Title): Withdraw Pending Application  
Test Executed Date: 01/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify a seeker can withdraw a pending application.  
Context: Users should be able to withdraw before decision.  

Precondition:
- User has a pending application.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open job card/modal | N/A | Withdraw option visible | As Expected | Pass | Withdraw option shown |
| 2 | Click Withdraw | N/A | Confirmation appears | As Expected | Pass | Withdraw confirmed |
| 3 | Confirm withdrawal | N/A | Application removed | As Expected | Pass | Application removed |

Post Condition: Application is withdrawn.

---

## Test Case ID: WF-TC-12
Tested By: Soyesh Shrestha  
Module Name (Test Title): Recruiter Post Job  
Test Executed Date: 09/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify recruiter can post a job.  
Context: Recruiters need to publish job listings.  

Precondition:
- User is logged in as recruiter.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Post Job page | N/A | Post Job form opens | As Expected | Pass | Post form opened |
| 2 | Fill required fields | "Frontend Developer" | Inputs accepted | As Expected | Pass | Fields filled |
| 3 | Submit job | N/A | Job created; success message | As Expected | Pass | Job posted |
| 4 | Verify job in listings | N/A | Job appears in dashboard | As Expected | Pass | Job visible |

Post Condition: Job listing is created.

---

## Test Case ID: WF-TC-13
Tested By: Soyesh Shrestha  
Module Name (Test Title): Edit Job  
Test Executed Date: 06/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify recruiter can update job details.  
Context: Recruiters may need to modify postings.  

Precondition:
- User is logged in as recruiter.
- Job exists.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Edit Job page | N/A | Edit form opens | As Expected | Pass | Edit form opened |
| 2 | Update job fields | Salary change | Fields updated | As Expected | Pass | Fields updated |
| 3 | Save changes | N/A | Success message; updated data shown | As Expected | Pass | Changes saved |

Post Condition: Job details are updated.

---

## Test Case ID: WF-TC-14
Tested By: Soyesh Shrestha  
Module Name (Test Title): Delete Job  
Test Executed Date: 31/12/2025  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify recruiter can delete a job posting.  
Context: Outdated roles should be removed.  

Precondition:
- User is logged in as recruiter.
- Job exists.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click Delete on job | N/A | Confirmation appears | As Expected | Pass | Delete prompt shown |
| 2 | Confirm delete | N/A | Job removed from listings | As Expected | Pass | Job deleted |

Post Condition: Job is deleted.

---

## Test Case ID: WF-TC-15
Tested By: Soyesh Shrestha  
Module Name (Test Title): View Applicants  
Test Executed Date: 31/12/2025  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify recruiter can view applicants for a job.  
Context: Recruiters need to manage candidate pipeline.  

Precondition:
- User is logged in as recruiter.
- Job has applicants.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Applicants page | N/A | Applicant list loads | As Expected | Pass | Applicants loaded |
| 2 | Verify applicant data | N/A | Name/email/status shown | As Expected | Pass | Details visible |
| 3 | Open View CV | N/A | Resume opens | As Expected | Pass | Resume opened |

Post Condition: Recruiter can access applicant list and resume.

---

## Test Case ID: WF-TC-16
Tested By: Soyesh Shrestha  
Module Name (Test Title): View Applicant Profile Details  
Test Executed Date: 01/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify recruiter can view applicant profile details.  
Context: Profile details aid evaluation.  

Precondition:
- Applicant profile has data.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click View Profile | N/A | Profile modal opens | As Expected | Pass | Profile modal opened |
| 2 | Verify details shown | N/A | Avatar/contact/skills visible | As Expected | Pass | Profile details shown |
| 3 | Close modal | N/A | Modal closes | As Expected | Pass | Modal closed |

Post Condition: Applicant profile details view works.

---

## Test Case ID: WF-TC-17
Tested By: Soyesh Shrestha  
Module Name (Test Title): Update Applicant Status  
Test Executed Date: 03/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify recruiter can shortlist or reject applicants.  
Context: Status management is required.  

Precondition:
- Applicant exists for the job.

Dependency:
- Jobs API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click Shortlist | N/A | Status changes to shortlisted | As Expected | Pass | Status set shortlisted |
| 2 | Click Reject | N/A | Status changes to rejected | As Expected | Pass | Status set rejected |

Post Condition: Applicant status is updated.

---

## Test Case ID: WF-TC-18
Tested By: Soyesh Shrestha  
Module Name (Test Title): Change Password  
Test Executed Date: 03/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify user can change password.  
Context: Users need to update credentials securely.  

Precondition:
- User is logged in.

Dependency:
- Auth API

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Open Profile > Account Settings | N/A | Change password form visible | As Expected | Pass | Password form opened |
| 2 | Enter current and new password | N/A | Inputs accepted | As Expected | Pass | Password entered |
| 3 | Submit | N/A | Success message shown | As Expected | Pass | Password updated |

Post Condition: Password updated and saved.

---

## Test Case ID: WF-TC-19
Tested By: Soyesh Shrestha  
Module Name (Test Title): FAQ Page  
Test Executed Date: 08/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify FAQ page loads and expands answers.  
Context: Users need quick help.  

Precondition:
- User can access the navbar.

Dependency:
- Frontend routing

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click About in navbar | N/A | FAQ page opens | As Expected | Pass | FAQ opened |
| 2 | Expand a FAQ item | N/A | Answer appears | As Expected | Pass | Answer expanded |

Post Condition: FAQ page is usable.

---

## Test Case ID: WF-TC-20
Tested By: Soyesh Shrestha  
Module Name (Test Title): Training Page  
Test Executed Date: 09/01/2026  
Test Executed Location: Web Application (Desktop - Chrome)  

Description: Verify training page loads and video thumbnails show.  
Context: Users can access learning resources.  

Precondition:
- User can access the navbar.

Dependency:
- Frontend routing
- YouTube thumbnails

Test Steps:
| Step | Test Step | Test Data | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | No issues found |
| 1 | Click Training in navbar | N/A | Training page opens | As Expected | Pass | Training opened |
| 2 | Verify thumbnails load | N/A | Thumbnails display with titles | As Expected | Pass | Thumbnails loaded |
| 3 | Open a video | N/A | Video opens in new tab | As Expected | Pass | External browser opened |

Post Condition: Training content is accessible.

