import { useRouter } from "next/router";
import useGoals from "../../hooks/use-goals";
import { FormEventHandler, useContext, useState } from "react";
import { CurrentAddressContext } from "../../hooks/SymfoniContext";
import Layout from "../../components/layout";
import { PlusIcon } from "@heroicons/react/solid";
import LinkContainer from "../../components/link-container";
import CreateGoalModal from "../../components/create-goal-modal";

function GoalsPage() {
    const { query } = useRouter();
    const [search, setSearch] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { goals, createGoal } = useGoals(query.user as string);
    const [currentAddress] = useContext(CurrentAddressContext);

    const handleCreate: FormEventHandler = (event) => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        console.log(data);
    };

    return (
        <Layout title={`Goals of ${query.user}`}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
                <header className="flex justify-between items-center">
                    <h1 className="uppercase text-xl font-medium text-gray-500">Goals</h1>
                    <div className="flex items-center space-x-2">
                        <div>
                            <label htmlFor="search" className="sr-only">
                                Search
                            </label>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-42 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search..."
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                        {currentAddress === query.user ? (
                            <>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setCreateModalOpen(true)}
                                >
                                    <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                                    Create Goal
                                </button>
                                <CreateGoalModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
                            </>
                        ) : null}
                    </div>
                </header>
                <section className="mt-10">
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {goals
                            .filter((goal) => goal.name.toLowerCase().includes(search.toLowerCase()))
                            .map((goal) => {
                                return (
                                    <li
                                        key={goal.name}
                                        className="col-span-1 bg-white transition hover:shadow-md overflow-hidden shadow rounded-lg sm:max-w-lg"
                                    >
                                        <LinkContainer href={`/${query.user}/${goal.name}`}>
                                            <div className="bg-blue-100 h-5">
                                                <div
                                                    role="progressbar"
                                                    aria-valuemin={goal.initial}
                                                    aria-valuemax={goal.target}
                                                    aria-valuenow={goal.progress}
                                                    aria-valuetext={goal.unit}
                                                    className="bg-blue-500 h-full"
                                                    style={{ width: `${goal.progress / goal.target}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center bg-white p-4">
                                                <div>
                                                    <h2 className="text-xl capitalize text-gray-900">{goal.name}</h2>
                                                    <p className="text-gray-500 mt-1">{new Date(goal.deadline.mul(1000).toNumber()).toDateString()}</p>
                                                </div>
                                                <p className="text-3xl text-gray-900 font-medium">100$</p>
                                            </div>
                                        </LinkContainer>
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            </div>
        </Layout>
    );
}

export default GoalsPage;
