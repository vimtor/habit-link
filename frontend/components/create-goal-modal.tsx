import { ReactNode, useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Category } from "../types/category";
import Input from "./input";
import FormGroup from "./form-group";
import Label from "./label";
import Select from "./select";
import { classNames } from "../utils/style";
import { useForm } from "react-hook-form";
import Modal from "./modal";
import dayjs from "dayjs";
import DatePicker from "./date-picker";
import { parseEther } from "ethers/lib/utils";
import { CreateGoal } from "../types/goal";
import { BigNumber } from "ethers";
import useExchangeRate from "../hooks/use-exchange-rate";

interface ExampleRadioProps {
    children: ReactNode;
    value: any;
}

const ExampleRadio = ({ children, value }: ExampleRadioProps) => (
    <RadioGroup.Option value={value} className="focus:outline-none">
        {({ active, checked }) => (
            <button
                type="button"
                className={classNames(
                    "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium hover:bg-blue-200 hover:border-current focus:outline-none border-2 border-transparent",
                    active && "focus:border-current",
                    checked ? "bg-blue-800 text-white hover:bg-blue-800 focus:border-blue-800 hover:border-blue-800" : "bg-blue-100 text-blue-800"
                )}
            >
                {children}
            </button>
        )}
    </RadioGroup.Option>
);

const EXAMPLE_VALUES = {
    weight: {
        name: "Lose weight",
        description: "Lose 20 pounds in 3 months",
        category: Category.TOTAL_LESS,
        unit: "pounds",
        progress: 80,
        target: 70,
        bounty: 0.015,
        deadline: dayjs().add(3, "month").endOf("day").format("YYYY-MM-DD"),
    },
    reading: {
        name: "Finish book",
        description: "Read all pages of 'Moby Dick' this month",
        category: Category.TOTAL_MORE,
        unit: "pages",
        progress: 270,
        target: 315,
        bounty: 0.015,
        deadline: dayjs().endOf("month").endOf("day").add(1, "day").format("YYYY-MM-DD"),
    },
    emails: {
        name: "Clean inbox",
        description: "Process all my 1000 unread emails this month",
        category: Category.LESS,
        unit: "emails",
        progress: 1000,
        target: 0,
        bounty: 0.015,
        deadline: dayjs().endOf("month").endOf("day").add(1, "day").format("YYYY-MM-DD"),
    },
    workout: {
        name: "Workout",
        description: "Get a 6 pack abs to show off for summer",
        category: Category.MORE,
        unit: "crunches",
        progress: 0,
        target: 1000,
        bounty: 0.015,
        deadline: dayjs().month(7).add(1, "year").format("YYYY-MM-DD"),
    },
};

interface CreateGoalModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (goal: CreateGoal) => Promise<void>;
}

interface FormValues {
    name: string;
    description: string;
    category: Category;
    progress: number;
    target: number;
    unit: string;
    deadline: string;
    bounty: string;
}

const CreateGoalModal = ({ open, onClose, onSave }: CreateGoalModalProps) => {
    const [showExamples, setShowExamples] = useState(false);
    const [selectedExample, setSelectedExample] = useState(null);
    const rates = useExchangeRate();
    const {
        register,
        setFocus,
        handleSubmit,
        watch,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm<FormValues>();

    const bounty = watch("bounty");
    const unit = watch("unit");

    const onSubmit = handleSubmit(async (data) => {
        await onSave({
            name: data.name,
            description: data.description,
            unit: data.unit,
            category: data.category,
            progress: BigNumber.from(data.progress),
            target: BigNumber.from(data.target),
            bounty: parseEther(data.bounty),
            deadline: BigNumber.from(dayjs(data.deadline, "YYYY-MM-DD").unix()),
        });
        onClose();
    });

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setFocus("name");
            }, 100);
        } else {
            setSelectedExample(null);
            setShowExamples(false);
            reset({});
        }
    }, [open]);

    useEffect(() => {
        if (selectedExample) {
            reset(EXAMPLE_VALUES[selectedExample!]);
        }
    }, [selectedExample]);

    useEffect(() => {
        if (isDirty) {
            setSelectedExample(null);
        }
    }, [isDirty]);

    return (
        <Modal open={open} onClose={onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Body>
                    <Modal.Title>Create new goal</Modal.Title>
                    {showExamples ? (
                        <RadioGroup onChange={setSelectedExample} value={selectedExample}>
                            <RadioGroup.Description className="text-sm mt-2 text-gray-500">
                                Click below to see how they will look{" "}
                                <span role="img" aria-describedby="point down">
                                    👇
                                </span>
                            </RadioGroup.Description>
                            <div className="flex space-x-2 mt-3">
                                {Object.entries(EXAMPLE_VALUES).map(([key, goal]) => (
                                    <ExampleRadio key={key} value={key}>
                                        {goal.name}
                                    </ExampleRadio>
                                ))}
                            </div>
                        </RadioGroup>
                    ) : (
                        <p className="text-sm mt-2 text-gray-500">
                            Unsure about what to create? Check some{" "}
                            <button onClick={() => setShowExamples(true)} className="text-blue-500">
                                examples.
                            </button>
                        </p>
                    )}
                    <div className="space-y-4 mt-5">
                        <FormGroup>
                            <Label htmlFor="name">Name</Label>
                            <Input {...register("name", { required: true })} placeholder="Do squats" type="text" id="name" />
                        </FormGroup>
                        <FormGroup>
                            <div className="flex justify-between">
                                <Label htmlFor="description">Description</Label>
                                <span className="text-sm text-gray-500" id="description-optional">
                                    Optional
                                </span>
                            </div>
                            <Input {...register("description")} placeholder="Do at least 20 squats every day" type="text" id="description" />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="category">Category</Label>
                            <Select {...register("category")} id="category">
                                <option value={Category.MORE}>Do more</option>
                                <option value={Category.LESS}>Do less</option>
                                <option value={Category.TOTAL_MORE}>Total more</option>
                                <option value={Category.TOTAL_LESS}>Total less</option>
                            </Select>
                            <p className="mt-1 text-sm text-gray-500" id="category-description">
                                This affects on how you input the data.{" "}
                                <a href="/docs/goal-category" target="_blank" tabIndex={-1} className="text-blue-500">
                                    Learn more.
                                </a>
                            </p>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="unit">Unit</Label>
                            <Input {...register("unit")} placeholder="squats" type="text" id="unit" />
                        </FormGroup>
                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 sm:justify-between">
                            <FormGroup>
                                <Label htmlFor="current">Current</Label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Input {...register("progress", { valueAsNumber: true })} placeholder="0" type="number" className="pr-12" id="current" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="lowercase text-gray-500 sm:text-sm" id="price-currency">
                                            {unit}
                                        </span>
                                    </div>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="target">Target</Label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Input {...register("target", { valueAsNumber: true })} placeholder="500" type="number" id="target" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="lowercase text-gray-500 sm:text-sm" id="price-currency">
                                            {unit}
                                        </span>
                                    </div>
                                </div>
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Label htmlFor="deadline">Deadline</Label>
                            <DatePicker {...register("deadline")} id="deadline" />
                            <p className="mt-1 text-sm text-gray-500" id="deadline-description">
                                If you don't reach the target before this date, you will lose the bounty.
                            </p>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="bounty">Bounty</Label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <Input {...register("bounty")} placeholder="0.00000" step="0.00001" type="number" id="bounty" className="pr-16" />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {bounty ? (
                                        <span className="text-gray-400 italic sm:text-sm" id="price-currency">
                                            <span className="invisible mr-2">{bounty}</span>&#8776; {(rates.usd * parseFloat(bounty)).toFixed(2)}$
                                        </span>
                                    ) : null}
                                </div>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                                        ETH
                                    </span>
                                </div>
                            </div>
                        </FormGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base disabled:bg-gray-400 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isSubmitting}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white  text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default CreateGoalModal;
