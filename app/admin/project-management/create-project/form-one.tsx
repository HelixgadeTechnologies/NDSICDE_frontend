"use client";

import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";

type FormOneProps = {
    onClick: () => void;
}

export default function FormOne({ onClick }: FormOneProps) {
    const handleNext = () => {
        onClick();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission
    };

    return (
        <section>
            <form className="space-y-6" onSubmit={handleFormSubmit}>
                <TextInput
                value=""
                label="Name of Project"
                placeholder="Enter Project name"
                name=""
                onChange={() => {}}
                />
                <DropDown
                label="Implementing Budget Currency"
                value=""
                name="implementingBudgetCurrency"
                placeholder="Budget Currency"
                onChange={() => {}}
                options={[]}
                />
                <DropDown
                label="Total Budget Amount"
                value=""
                name="totalBudgetAmount"
                placeholder="Total Budget amount"
                onChange={() => {}}
                options={[]}
                />
                <div className="flex items-center gap-[18px] w-full">
                    <DateInput
                    label="Start Date"
                    placeholder="Start Date"
                    />
                    <DateInput
                    label="End Date"
                    placeholder="End Date"
                    />
                </div>
                <DropDown
                label="Country"
                value=""
                name="country"
                placeholder="Enter Country"
                onChange={() => {}}
                options={[]}
                />
                <div className="flex gap-8 items-center">
                    <div className="w-2/5">
                        <Button
                        isSecondary
                        content="Cancel"
                        href="/admin/project-management"
                        />
                    </div>
                    <div className="w-3/5">
                        <Button
                        content="Next"
                        onClick={handleNext}
                        // type="button"
                        />
                    </div>
                </div>
            </form>
        </section>
    )
}