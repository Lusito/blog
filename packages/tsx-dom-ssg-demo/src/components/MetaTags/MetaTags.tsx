import { BaseProps } from "tsx-dom-ssr";

import { siteTitle, siteUrl } from "../../utils/config";

type MetaTagsBaseProps = {
    title: string;
    image: string;
    description: string;
    slug: string;
    // fixme: image:type, image:width, image:height, image:alt
};

type MetaTagsProps = BaseProps & MetaTagsBaseProps;

// fixme: ensure it's set on all pages
export const MetaTags = ({ title, image, description, slug, children }: MetaTagsProps) => (
    <head>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:image" content={`${siteUrl}/assets/${image}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={`${siteUrl}/${slug}`} />
        {children}
    </head>
);

type MetaTagsArticleProps = MetaTagsBaseProps & {
    publishedTime: Date;
    modifiedTime?: Date;
    tags: string[];
};

export const MetaTagsArticle = ({ publishedTime, modifiedTime, tags, ...rest }: MetaTagsArticleProps) => (
    <MetaTags {...rest}>
        <meta name="keywords" content={tags.join(", ")} />
        <meta name="author" content="Santo Pfingsten" />
        <meta property="og:type" content="article" />
        <meta property="og:author" content="Santo Pfingsten" />
        <meta property="og:published_time" content={publishedTime.toISOString()} />
        {modifiedTime && <meta property="og:modified_time" content={modifiedTime.toISOString()} />}
        {tags.map((tag) => (
            <meta property="og:tag" content={tag} />
        ))}
    </MetaTags>
);

type MetaTagsProfileProps = MetaTagsBaseProps & {
    firstName: string;
    lastName: string;
    username: string;
    gender: "male" | "female";
};

export const MetaTagsProfile = ({ firstName, lastName, username, gender, ...rest }: MetaTagsProfileProps) => (
    <MetaTags {...rest}>
        <meta property="og:type" content="profile" />
        <meta property="og:first_name" content={firstName} />
        <meta property="og:last_name" content={lastName} />
        <meta property="og:username" content={username} />
        <meta property="og:gender" content={gender} />
    </MetaTags>
);