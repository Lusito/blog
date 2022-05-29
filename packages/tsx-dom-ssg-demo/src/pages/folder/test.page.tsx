import { Article } from "../../components/Article/Article";
import { DefaultLayout } from "../../layouts/DefaultLayout";

export default async function FolderTestPage() {
    return (
        <DefaultLayout pageTitle="All" siteTitle="Lusitos Blog">
            <main>
                <Article title="Some Article">Whooo</Article>
            </main>
        </DefaultLayout>
    );
}
