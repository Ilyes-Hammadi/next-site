module.exports = {
  name: 'Fetching Data for Pages',
  intro: `
Now we know how to create a pretty decent Next.js app and get the full advantage of the Next.js routing API.

In practice, we usually need to fetch data from a remote data source. Next.js comes with a standard API to fetch data for pages. We do it using an async function called \`getInitialProps\`.

With that, we can fetch data for a given page via a remote data source and pass it as props to our page. We can write our \`getInitialProps\` to work on both server and the client. So, Next.js can use it on both client and server.

In this lesson, using \`getInitialProps\`, we are going to build an app which shows information about Batman TV Shows, utilising the public [TVmaze API](http://www.tvmaze.com/api).

![](https://cloud.githubusercontent.com/assets/50838/26300776/bbf275ee-3efc-11e7-8304-df96c7c7cad5.png)

Let's get started.
  `,
  steps: [
    {
      id: 'setup',
      type: 'text',
      points: 5,
      text: `
## Setup

In this lesson, we need a simple Next.js app to play with. Try to download the following example app:

~~~bash
git clone https://github.com/arunoda/learnnextjs-demo.git
cd learnnextjs-demo
git checkout clean-urls-ssr
~~~

You can run it with:

~~~bash
npm install
npm run dev
~~~

Now you can access the app by navigating into http://localhost:3000/.
      `
    },

    {
      id: 'fetching-batman-shows',
      type: 'mcq',
      points: 30,
      answers: [
        'On server console',
        'On browser console',
        'On both console',
        'Not printed on any console'
      ],
      correctAnswer: 'On server console',
      text: `
## Fetching Batman Shows

In our demo app, we have a list of blog posts on the home page. Now we are going to display a list of Batman TV shows.
Instead of hardcoding those shows, we are going to fetch them from a remote server.

> Here we are using the [TVMaze API](http://www.tvmaze.com/api) to fetch those TV shows.
> It's an API to search for TV shows information.

First of all we need to install [isomorphic-unfetch](https://github.com/developit/unfetch). That's the library we are going to use to fetch data. It's a simple implementation of the browser [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) API, but works both in client and server environments.

~~~bash
npm install --save isomorphic-unfetch
~~~

Then replace our \`pages/index.js\` with the following content:

~~~bash
import Layout from '../components/MyLayout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
  <Layout>
    <h1>Batman TV Shows</h1>
    <ul>
      {props.shows.map(({show}) => (
        <li key={show.id}>
          <Link as={\`/p/\${show.id}\`} href={\`/post?id=\${show.id}\`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)

Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
  const data = await res.json()

  console.log(\`Show data fetched. Count: \${data.length}\`)

  return {
    shows: data
  }
}

export default Index
~~~

Everything on the above page will be familiar to you except the \`Index.getInitialProps\` as shown below:

~~~js
Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
  const data = await res.json()

  console.log(\`Show data fetched. Count: \${data.length}\`)

  return {
    shows: data
  }
}
~~~

That's a static async function you can add into any page in your app. Using that, we can fetch data and send them as props to our page.

As you can see, now we are fetching Batman TV shows and passing them into our page as the 'shows' prop.

![](https://cloud.githubusercontent.com/assets/50838/26300128/de007dd6-3efa-11e7-9084-6ba7ff10774b.png)

---

As you can see in the above \`getInitialProps\` function, it prints the number of data fetched to the console.
Now, have a look at both the browser console and server console.
Then reload the page.

Where did you see the above message printed _after_ page reload?
      `
    },

    {
      id: 'only-on-the-server',
      type: 'text',
      points: 5,
      text: `
## Only on the Server

In this case, the message only printed on the server.

That's because we render the page on the server.
So, we already have the data and there is no reason to fetch it again in the client.
      `
    },

    {
      id: 'fetching-data-for-pages',
      type: 'mcq',
      points: 25,
      answers: [
        'On server console',
        'On browser console',
        'On both console',
        'Not printed on any console'
      ],
      correctAnswer: 'On browser console',
      text: `
## Implement the Post Page

Now let's try to implement the “/post” page where it shows the detailed information about the TV show.

First, open the \`server.js\` and change the \`/p/:id\` route with the following content:

~~~js
server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
})
~~~

Then restart your app to apply the above code change.

> Earlier, we mapped the \`title\` query param to the page. Now we need to rename it to \`id\`.

Now replace the \`pages/post.js\` with the following content:

~~~js
import Layout from '../components/MyLayout.js'
import fetch from 'isomorphic-unfetch'

const Post = (props) => (
    <Layout>
       <h1>{props.show.name}</h1>
       <p>{props.show.summary.replace(/<[\/]?p>/g, '')}</p>
       <img src={props.show.image.medium}/>
    </Layout>
)

Post.getInitialProps = async function (context) {
  const { id } = context.query
  const res = await fetch(\`https://api.tvmaze.com/shows/\${id}\`)
  const show = await res.json()

  console.log(\`Fetched show: \${show.name}\`)

  return { show }
}

export default Post
~~~

Have a look at the \`getInitialProps\` of that page:

~~~js
Post.getInitialProps = async function (context) {
  const { id } = context.query
  const res = await fetch(\`https://api.tvmaze.com/shows/\${id}\`)
  const show = await res.json()

  console.log(\`Fetched show: \${show.name}\`)

  return { show }
}
~~~

In that, the first argument of the function is the **context** object. It has a query field that we can use to fetch information.

In our example, we picked the show ID from query params and fetched its show data from the TVMaze API.

---

In this \`getInitialProps\` function, we have added a \`console.log\` to print the show title. Now we are going to see where it's going to print.

Open both the server console and the client console.
Then visit to the home page http://localhost:3000 and click on the first Batman show title.

In what places have you seen the above mentioned \`console.log\` message?
      `,
    },

    {
      id: 'fetch-data-in-client-side',
      type: 'text',
      points: 5,
      text: `
## Fetch Data in Client Side

Here we can only see the message on the browser console.
That's because we navigated to the post page via the client side. Then fetching data from the client side is the best way to do it.

If you just visit a post page directly (eg:- http://localhost:3000/p/975) you'll be able to see the message printed on the server but not in the client.
      `
    },

    {
      id: 'finally',
      type: 'text',
      points: 5,
      text: `
## Finally

Now you have learned one of the most crucial features of Next.js that makes it ideal for universal data fetching and server side rendering.

We have learned the basics of \`getInitialProps\` which is enough for most of the use cases. You can always refer to Next.js documentation on [data fetching](https://github.com/zeit/next.js#fetching-data-and-component-lifecycle) for more information.
      `
    }
  ]
}
