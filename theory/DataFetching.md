``Three Types of Data Fetching : ``
* **server sider rendering (SSR)** : no caching new request to be made everytime. 

* **Static Site Generation (SSG)** : Caching the responses best for immutable content like blogs so . **Next.js uses this type of data fetching by default**. 

* **Incremental Static Generation (ISR)** : refetching the data after some fixed amount of time revalidating the data. 
