import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: number;
}

export async function generateLast12MonthData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 11; i >= 0; i--) {
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i + 1,
            0
        );

        const monthYear = endDate.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        } as any);

        last12Months.push({ month: monthYear, count });
    }

    return { last12Months };
}
