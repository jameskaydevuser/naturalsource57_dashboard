import { Helmet } from 'react-helmet-async';

import { NewsView } from 'src/sections/news/view';

// ----------------------------------------------------------------------

export default function NewsPage() {
    return (
        <>
            <Helmet>
                <title> News | Natural Source </title>
            </Helmet>

            <NewsView />
        </>
    );
}
