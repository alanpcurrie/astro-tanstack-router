---
import { App } from "~/components/App";
import Layout from "~layouts/Layout.astro";
-- // import Hello from "../components/Hello.elm";
import Main from "../components/Main.elm";
---

<Layout title="Dashboard">
   <App client:only="react" />
   <!-- <Hello /> from Astro and Elm! -->
   -- <Main /> check
</Layout>