import { DateTime } from "../DateTime/DateTime";

type ArticleDateSubTitleProps = {
    created: Date;
    modified?: Date;
};

export const ArticleDateSubTitle = ({ created, modified }: ArticleDateSubTitleProps) => (
    <>
        {"Written "}
        <b>
            <DateTime date={created} />
        </b>
        {modified && (
            <span>
                , updated <DateTime date={created} />
            </span>
        )}
    </>
);
