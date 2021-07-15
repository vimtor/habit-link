import { useRouter } from "next/router";

function GoalPage() {
    const { query } = useRouter();
    return <pre>{JSON.stringify(query, null, 2)}</pre>;
}

export default GoalPage;
