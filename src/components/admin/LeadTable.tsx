
import LeadsTable from "./leads/LeadsTable";

// This component serves as a wrapper to maintain backward compatibility
// The special leads-only user (ID: 7eccf781-5911-4d90-a683-1df251069a2f) has full access
const LeadTable = () => {
  return <LeadsTable />;
};

export default LeadTable;
