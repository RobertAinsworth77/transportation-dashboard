# Production Deployment Plan
## ITEL Transportation System - Production Roll Out

### Overview
This document outlines the production deployment strategy developed on December 2, 2025, for the ITEL Transportation system including React Admin Dashboard, Flutter Driver App, and Flutter Employee App.

**Timeline Estimate**: 2-4 hours for backend deployment, 24-48 hours for mobile app store reviews

---

## Deployment Steps

### 1. DATABASE
- [ ] **i.** Export/backup production database
- [ ] **ii.** Run SQL migration scripts on production database (itel_datasi)
- [ ] **iii.** Verify data integrity after migrations

### 2. LAMBDA FUNCTIONS
- [ ] **i.** Build production container image
- [ ] **ii.** Push to ECR
- [ ] **iii.** Update production Lambda functions to use new image

### 3. API GATEWAY
- [ ] **i.** Create/update routes on prod stage
- [ ] **ii.** Add Lambda permissions for API Gateway invoke
- [ ] **iii.** Deploy to prod stage
- [ ] **iv.** Flush Cache

### 4. VERIFY ENDPOINTS
- [ ] **i.** Test each new endpoint returns expected data
- [ ] **ii.** Check CloudWatch logs for errors

### 5. REACT ADMIN DASHBOARD
- [ ] **i.** Merge feature branch to main branch
- [ ] **ii.** Update API endpoint in code to production API Gateway URL
- [ ] **iii.** Build production bundle
- [ ] **iv.** Deploy via App Runner

### 6. FLUTTER DRIVER APP
- [ ] **i.** Merge feature branch to main branch
- [ ] **ii.** Update HostApi.dart to production API Gateway URL
- [ ] **iii.** Increment version/build numbers in pubspec.yaml
- [ ] **iv.** Build Android release
- [ ] **v.** Build iOS release
- [ ] **vi.** Upload to Play Console
- [ ] **vii.** Upload to App Store Connect

### 7. FLUTTER EMPLOYEE APP
- [ ] **i.** Same steps as Driver App (steps i-vii above)

---

## ROLLBACK PLAN

### Immediate Rollback Options
- [ ] **i.** Keep previous lambda image tags
- [ ] **ii.** Keep previous API Gateway deployment
- [ ] **iii.** Database backup for rollback

### Rollback Procedures
1. **Lambda Functions**: Revert to previous image tag in Lambda console
2. **API Gateway**: Redeploy previous stage deployment
3. **Database**: Restore from backup (requires maintenance window)
4. **React Dashboard**: Redeploy previous App Runner version
5. **Mobile Apps**: Cannot rollback immediately (requires new app store submission)

---

## Critical Success Factors

### Pre-Deployment Checklist
- [ ] Production database backup completed and verified
- [ ] All feature branches merged and tested
- [ ] Production API Gateway URLs updated in all applications
- [ ] Lambda container images built and pushed to ECR
- [ ] App store developer accounts ready for mobile app uploads

### Post-Deployment Verification
- [ ] All API endpoints responding correctly
- [ ] CloudWatch logs show no errors
- [ ] React dashboard loads and functions properly
- [ ] Mobile apps submitted to app stores successfully

### Risk Mitigation
- **Database**: Always backup before migration, test scripts on copy first
- **API Gateway**: Keep previous deployment for quick rollback
- **Lambda**: Tag images properly for easy version management
- **Mobile Apps**: Plan for 24-48 hour app store review time

---

## Timeline Breakdown

### Backend Deployment (2-4 hours)
- **Hour 1**: Database backup and migration
- **Hour 2**: Lambda and API Gateway deployment
- **Hour 3**: Endpoint verification and testing
- **Hour 4**: React dashboard deployment

### Mobile App Deployment (24-48 hours)
- **Day 1**: Build and submit apps to stores
- **Day 1-2**: App store review process
- **Day 2**: Apps available to users (if approved)

---

## Emergency Contacts
- **Database Issues**: [DBA Contact]
- **AWS Infrastructure**: [DevOps Contact]
- **Mobile Apps**: [Mobile Dev Team]
- **Business Critical**: [Project Manager]

---

**Document Version**: 2.0 (Updated from December 2, 2025 plan)  
**Last Updated**: January 8, 2026  
**Original Plan Date**: December 2, 2025
