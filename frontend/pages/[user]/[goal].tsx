import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { ReactNode } from "react";
import { classNames } from "../../utils/style";
import FormGroup from "../../components/form-group";
import Input from "../../components/input";
import Label from "../../components/label";
import ButtonGroup from "../../components/button-group";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(calendar);
dayjs.extend(relativeTime);

interface CardProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    className?: string;
}

function Card({ children, title, subtitle, className }: CardProps) {
    return (
        <section className={classNames("bg-white overflow-hidden shadow rounded-lg", className)}>
            <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{title}</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
                {children}
            </div>
        </section>
    );
}

function GoalPage() {
    const { query } = useRouter();
    return (
        <Layout title="">
            <h1 className="text-center text-4xl sm:leading-tight sm:text-5xl font-medium text-gray-700 py-16 px-2">
                Run a marathon before <span className="font-semibold">10&nbsp;days</span> to&nbsp;claim&nbsp;<span className="font-semibold">100$</span>
            </h1>
            <div className="relative shadow-inner bg-blue-100 h-20 sm:h-28">
                <div
                    role="progressbar"
                    // aria-valuemin={goal.initial.toNumber()}
                    // aria-valuemax={goal.target.toNumber()}
                    // aria-valuenow={goal.progress.toNumber()}
                    // aria-valuetext={goal.unit}
                    className="bg-blue-500 h-full"
                    style={{ width: "75%" }}
                />
                <p className="absolute text-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-sm text-5xl sm:text-6xl font-semibold">
                    140<span className="text-3xl sm:text-4xl ml-2 font-medium">miles</span>
                </p>
            </div>
            <div className="mt-10 space-y-4 max-w-6xl mx-auto md:space-y-0 md:grid md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2" title="About" subtitle="Information about the goal">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 mt-4">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">Run 9 miles</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900">Fugiat ipsum ipsum deserunt culpa aute sint.</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Initial</dt>
                            <dd className="mt-1 text-sm text-gray-900">70 miles</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Progress</dt>
                            <dd className="mt-1 text-sm text-gray-900">140 miles</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Target</dt>
                            <dd className="mt-1 text-sm text-gray-900">200 miles</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Started</dt>
                            <dd className="mt-1 text-sm text-gray-900">{dayjs("2021-01-01").from(dayjs())}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                            <dd className="mt-1 text-sm text-gray-900">{dayjs().calendar()}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Bounty</dt>
                            <dd className="mt-1 text-sm text-gray-900">100$</dd>
                        </div>
                    </dl>
                </Card>
                <Card title="Progress" subtitle="Update your current progress">
                    <form className="flex flex-col justify-between h-full space-y-4 mt-4">
                        <div>
                            <FormGroup>
                                <Label htmlFor="amount" className="sr-only">
                                    Amount
                                </Label>
                                <div className="relative rounded-md shadow-sm">
                                    <Input placeholder="0" name="amount" id="amount" type="number" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="lowercase text-gray-500 sm:text-sm" id="price-currency">
                                            miles
                                        </span>
                                    </div>
                                </div>
                            </FormGroup>
                            <ButtonGroup>
                                <ButtonGroup.Option>+1</ButtonGroup.Option>
                                <ButtonGroup.Option>+5</ButtonGroup.Option>
                                <ButtonGroup.Option>+10</ButtonGroup.Option>
                                <ButtonGroup.Option>+50</ButtonGroup.Option>
                            </ButtonGroup>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-auto text-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Progress
                        </button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}

export default GoalPage;
