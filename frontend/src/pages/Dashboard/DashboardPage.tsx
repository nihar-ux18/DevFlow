import { Card } from "../../components/ui/Card/Card";

export const DashboardPage = () => {
    return(
        <div>
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>Task</Card>
                <Card>Notes</Card>
                <Card>Focus Time</Card>
            </div>
        </div>
    );
};

export default DashboardPage;