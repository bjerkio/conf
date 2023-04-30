# Infrastructure Core

This repository contains the organization of Bjerk's own Google Cloud Platform
projects.

## Google Organization Roles

To promote the least privilege principle, only administrator accounts should be
granted higher roles in the organization. We use Google Groups to manage the
roles in the organization to make it easier to manage.

- `gcp-billing-administrators@bjerk.io` is given access `roles/billing.admin` on
  the organization level and external billing accounts.
- `gcp-billing-viewers@bjerk.io` is given access `roles/billing.viewer` or
  `roles/billing.costsManager` on the organization level and external billing
  accounts.
- `gcp-organization-admins@bjerk.io` is given access
  `roles/resourcemanager.organizationAdmin` and
  `roles/resourcemanager.projectCreator` on the organization level.
- `gcp-organization-viewers@bjerk.io` is given access
  `roles/resourcemanager.organizationViewer` on the organization level.

To retrieve access to projects, IAM roles should be explicitly granted on the
project level. When giving everyone in the company access, the
`developers@bjerk.io` can be used, and when used should be given the least
amount of privileges possible (e.g. `roles/viewer`).

**Note**: These roles are not automatically granted to the groups, they are
managed manually by administrators. Groups are also managed manually by
administrators, only given access to users with protected accounts.
