export type DateTimeProps = {
    date: Date;
};

export const DateTime = ({ date }: DateTimeProps) => (
    <time dateTime={date.toISOString().split("T")[0]}>{date.toDateString()}</time>
);
