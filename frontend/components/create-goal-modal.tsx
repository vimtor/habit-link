import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Input from "./input";
import FormGroup from "./form-group";
import Label from "./label";
import Select from "./select";
import { CalendarIcon } from "@heroicons/react/solid";
import { classNames } from "../utils/style";

function ExampleRadio({ children, value }) {
    return (
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
}

const CreateGoalModal = ({ open, onClose, onSave }) => {
    const [showExamples, setShowExamples] = useState(false);
    const [selectedExample, setSelectedExample] = useState(null);

    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setSelectedExample(null);
                setShowExamples(false);
            }, 100);
        }
    }, [open]);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={open} onClose={onClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-3 text-center sm:mt-0 sm:text-left">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                    Create new goal
                                </Dialog.Title>
                                {showExamples ? (
                                    <RadioGroup onChange={setSelectedExample} value={selectedExample}>
                                        <RadioGroup.Description className="text-sm mt-2 text-gray-500">
                                            Click below to see how they will look{" "}
                                            <span role="img" aria-describedby="point down">
                                                👇
                                            </span>
                                        </RadioGroup.Description>
                                        <div className="flex space-x-2 mt-2">
                                            <ExampleRadio value="lose-weight">Lose weight</ExampleRadio>
                                            <ExampleRadio value="read-more">Read more</ExampleRadio>
                                            <ExampleRadio value="quit-smoking">Quit smoking</ExampleRadio>
                                            <ExampleRadio value="do-exercise">Do exercise</ExampleRadio>
                                        </div>
                                    </RadioGroup>
                                ) : (
                                    <p className="text-sm mt-2 text-gray-500">
                                        Unsure about what to create? Check some{" "}
                                        <button onClick={() => setShowExamples(true)} className="text-blue-500">
                                            examples
                                        </button>
                                        .
                                    </p>
                                )}
                                <div className="space-y-4 mt-5">
                                    <FormGroup>
                                        <Label htmlFor="name">Name</Label>
                                        <Input required placeholder="Do squats" type="text" name="name" id="name" />
                                    </FormGroup>
                                    <FormGroup>
                                        <div className="flex justify-between">
                                            <Label htmlFor="description">Description</Label>
                                            <span className="text-sm text-gray-500" id="description-optional">
                                                Optional
                                            </span>
                                        </div>
                                        <Input placeholder="Do at least 20 squats every day" type="text" name="description" id="description" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="category">Category</Label>
                                        <Select id="category" name="category" defaultValue="MORE">
                                            <option value="MORE">Do more</option>
                                            <option value="LESS">Do less</option>
                                            <option value="TOTAL_MORE">Total more</option>
                                            <option value="TOTAL_LESS">Total less</option>
                                        </Select>
                                        <p className="mt-1 text-sm text-gray-500" id="category-description">
                                            This affects on how you input the data.{" "}
                                            <a href="/docs/goal-category" target="_blank" className="text-blue-500">
                                                Learn more.
                                            </a>
                                        </p>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="unit">Unit</Label>
                                        <Input placeholder="Squats" type="text" name="unit" id="unit" />
                                    </FormGroup>
                                    <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 sm:justify-between">
                                        <FormGroup>
                                            <Label htmlFor="progress">Progress</Label>
                                            <Input placeholder="0" type="number" name="progress" id="progress" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="target">Target</Label>
                                            <Input placeholder="500" type="number" name="target" id="target" />
                                        </FormGroup>
                                    </div>
                                    <FormGroup>
                                        <Label htmlFor="bounty">Bounty</Label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <Input placeholder="0.00" type="text" name="bounty" id="bounty" className="pr-12" />
                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                <label htmlFor="currency" className="sr-only">
                                                    Currency
                                                </label>
                                                <select
                                                    id="currency"
                                                    name="currency"
                                                    className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                                    defaultValue="ETH"
                                                >
                                                    <option>USD</option>
                                                    <option>EUR</option>
                                                    <option>ETH</option>
                                                </select>
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="deadline">Deadline</Label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <Input placeholder="DD/MM/YYYY" className="pl-10" type="text" name="deadline" id="deadline" />
                                        </div>
                                    </FormGroup>
                                </div>
                            </form>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onSave}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default CreateGoalModal;
