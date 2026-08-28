import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { OrganizationsTab } from "./AdminPage";

export default function SystemOrganizationsPage() {
  return (
    <Box>
      <PageHeader title="Organizations" subtitle="Manage businesses on the platform" breadcrumb="Organizations" />
      <Box sx={{ mt: 2 }}>
        <OrganizationsTab />
      </Box>
    </Box>
  );
}
