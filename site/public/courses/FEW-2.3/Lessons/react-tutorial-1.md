# React Tutorial 1

The goal of this tutorial is to learn the foundational concepts of React by building a web site using React. This tutorial will keep things simple and focus on only a few core concepts. Future lessons will build on these concepts

Besides using this tutorial to create a Website with React you can use this as a guide to get started with future React projects. 

## Step 1: Create React App

**Create a new React App**. Navigate to a location on your computer where you want the project to live and replace `<name>` with the name of your project. 

`npx create-react-app <name>` 

> here you are installing the react starter project from the React Team at Facebook. While you can install React manually the boilerplate code installed by `create-react-app` is comprehensive and up to date. Use this whenever possible. 

### Note! 

**If you're having errors installing Create React App** it could be a problem with the version of Node.js that is installed. Try installing [nvm](https://github.com/nvm-sh/nvm#installation-and-update) (Node Version Manager).

Use nvm to install a specific version of node: 

`nvm install <0.0.0>` For example `nvm install 10.16` installs node 10.16 which was the latest version Node at the time I wrote this. 

Use nvm to select and use the a sepcific version of node: 

`nvm use 10.16` uses Node version 10.16. 

## Step 2: Run your App 

**Run your app**. Navigate to the react project folder and the following command.  

`npm start`

After starting up your app should be running at  [http://localhost:3000/](http://localhost:3000/)

> Here you are running some background services that bundle your app. React apps are written with the ES6 version of JavaScript along with JSX an extension of the JS language. This code does not run in the browser it needs to be transpiled to vanilla ES5 version of JS first. 

> The command also starts a local server that hosts your project, watches for changes to files in the project folder and relaunches the server when changes occur. 

## Step 3: Explore the app 

**Explore the project**. Create React generates many files and arranges them in directories. 

- `node_modules`
- `public`
- `.gitignore`
- `package.json`
- `README.md`

You will do all of your work in the src directory. The other files and folders you can ignore for now. 

`README.md` contains reference info about create react app. Look here for rminders about the npm commands used with create-react-app.

Take a look in `src`:

- `src` 
  - `App.css`
  - `App.js`
  - `App.test.js`
  - `index.css`
  - `index.js`
  - `logo.svg`
  - `serviceWorker.js`

These are files that make up the app. Running the default project you should see a web page that is generated at `index.js`. Think of this the entry point of the app. You don't ever need to edit this file. 

React Projects are built from Components. This default project has one Component: `App` which defined in the file `App.js`. This Component generates everything you are seeing in the borwser. 

Take a look at `index.js`. You'll see that this file imports `App.js` at the top of the page.

`import App from './App';` 

Further down the code you'll that the `App` Component is used here:

`ReactDOM.render(<App />, document.getElementById('root'));`

This is the top level component. While `App` is a single component all the components it contains will be rendered. 

Take a look at `App.js` to see what it renders. 

In `App.js` you'll see a single function that returns a block of what appears to be HTML. Notice the HTML is not a string. _This is **JSX**_.

> JSX is an extension of the JS language. JSX is transpiled into plain JS before the App is run. This transpiling process is handled by Webpack and it is why you build and run the app from the command line. 

## Step 4: Make a Header Component

**Make a new Component**. Make a new file: 

`src/PageHeader.js`

Use this for the header of your page. Add the following: 

```JS
import React from 'react'

function PageHeader() {
  return (
    <div>
      <h1>Name of your site here</h1>
    </div>
  )
}

export default PageHeader
```

A simple React Component is just a function that returns some JSX! 

> You must import `React` to use JSX! You may have noticed that `React` was not used in this file but it was imported anyway. `React` must be in scope when using JSX. 

> JSX must always have a top level node. 

```JSX
// Error! Sibling nodes 
<h1>Hello</h1>
<p>World</p>
```

```JSX
// Good! has a single top level element
<div>
  <h1>Hello</h1>
  <p>World</p>
</div> 
```

> If you are returning a multiline JSX statement wrap it in the `(` and `)`. 

```JSX 
function MyComp() {
  return <h1>Hello World</h1> // Good! Single line
}
```

```JSX 
function MyComp() {
  // Good! Multiline wrapped in ( ... ) also has a single top level node.
  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  )
}
```

> Here you exported Header as the _default export_. Any file/module may have a single `default` export. Use the default export for the most import export. In this case we only export one thing making it the obvious choice for the default export!

## Step 5: Import and use Header

**Use the header**. In App.js import `Header`: 

`import PageHeader from './PageHeader'`

Here you are importing the default export from `PageHeader.js`. 

The `.js` file extension is optional when using import! `import PageHeader from './PageHeader.js'` would also work here. 

Now use the header inside the `App` component. In `App.js` rewrite the existing component: 

```JS 
function App() {
  return (
    <div className="App">
      <PageHeader />
    </div>
  );
}
```

> Here you imported your component and used that component the page. 

> Notice you imported `PageHeader` and used it as a component by writing it like an HTML tag like this: `<PageHeader />`

> Since the Component doesn't have any child components you can use a self closing tag (`<TagName />` instead of `<TagName>...</TagName>`).

## Step 6: Style your Header

**Add some styles to the header**. CSS styles are applied to React components in the same way they are applied to regular HTML with a few notable differences. 

The Create React App Webpack Build system will import styles and include them in a Component when you import a `.css` file into that component. 

This system is good because it allows you to associate styles with components. Rather than throwing all of your styles into single style sheet. 

Add a new File:

`src/PageHeader.css`

Add the following CSS styles: 

```CSS
.PageHeader {
  width: 100%;
  display: flex; 
  justify-content: center;
  padding: 1em;
  background-color: rgb(19, 99, 99);
  color: #fff;
}
```

In `PageHeader.js` import the CSS code and add a class name to reference this style rule. 

Import the CSS file at the top of the page:

`import './PageHeader.css'`

When assigning a class name to a JSX tag use the name `className` in place of `class`.

```JS
function PageHeader() {
  return (
    <div className="PageHeader">
      <header>
        <h1>SF Public Spaces</h1>
      </header>
    </div>
  )
}
```

> The build script will inlcude styles that are imported into a component. 

> When assigning a class to JSX elements use `className` in in place of `class`

## Step 7: Create a Content Container 

**Create a content container component**. Make a new file:

`src/PageContent.js`

Add some code: 

```JS
import React from 'react'

function PageContent() {
  return (
    <div>
      <h2>Content here...</h2>
    </div>
  )
}

export default PageContent
```

Import this file and use the new Component in App.js 

`import PageContent from './PageContent'`

Then use the new Component

```JS
function App() {
  return (
    <div className="App">
      <PageHeader />
      <PageContent />
    </div>
  );
}
```

> React uses a Component Architecture. Notice here how one component can contain another component and the App is built from many components each designed to display a single UI element. 

## Step 8: Add some Content to the container

**Add content to your container**. Here the goal is to display a list of your projects in the content page. Each project will use the same component but will eventually display different information for each project.

For now imagine each project has the following elements: 

- Image
- Title
- Link 

Make a component to show a project. 

`src/Project.js`

Add the following code

```js
import React from 'react'

function Project() {
  return (
    <div>
      <img src="#" width="300" height="200" />
      <h3>Title of Project</h3>
      <a href="#">Link to project</a>
    </div>
  ) 
}

export default Project
```

Import and add a few Projects to your Content Page. 

In `PageContent.js` add import Project: 

`import Project from './Project'`

Then add a few Projects: 

```JS
function PageContent() {
  return (
    <div>
      <Project />
      <Project />
      <Project />
      <Project />
      <Project />
      <Project />
    </div>
  )
}
```

This should now show a list of 6 projects in PageContent which is display in App. 

While this is working it's less than ideal since all of the projects has the same title, image src, and link url. You will address this in the coming steps. 

> Components can be reused and nested. You've used the `Project` component 6 times here. Each is separate and unique instance of `Project.js`. 

> All of these components are wrapped up in the `PageContent` which is rendered by the `App` component.

## Step 9: Add some Local Image Files

**Create an images folder**. This will need to be placed in the public folder. Your React project is run from the `public` directory after the source files are transpiled. 

Images and other static files that your project will use must be referenced with the public directory as the root.  

Make a new filder: 

`public/images/`

Put a couple images in this folder. 

Reference an image from your Porject component. Do this by updating the project component with a path to one of your images. 

```js
function Project() {
  return (
    <div>
      <img src='/images/kitten-0.jpeg' width="300" height="200" />
      <h3>Title of Project</h3>
      <a href="#">Link to project</a>
    </div>
  ) 
}
```

> Static files must either be imported into a component or stored in the `public directory`. The code you write in the `src` directory is not used directly. It is transpiled and resulting bundle is run from the `public` directory.  

## Step 10: Making Dynamic Components with Props

**Components can be made dynamic by using props**. Props are values (think _properties_) that are passed into the Component from outside. 

Above you created a list of `<Project />` component instances each of which displays exactly the same thing. The goal of this step is to make this component dynamic by adding props. This will allow each instance to be configured differently. 

Props is always an Object with properties. All of the values that you want to pass into a component will be attached to this Object. 

In the case of the `Project` Component there are three things that need to be dynamic: 

- title 
- image url 
- link url 

You'll need to define a key on the props object for each of these values. Do this in `Project.js` by making these changes:

```js
function Project(props) {
  return (
    <div>
      <img src={props.image} width="300" height="200" />
      <h3>{props.title}</h3>
      <a href={props.link}>Link to project</a>
    </div>
  ) 
}
```

Notice when using JavaScript expressions in a JSX block you must wrap the expression in `{` and `}`. You see this here with `src`, the text content of the `<h3>`, and `href`. If the value is a string just use the quotation marks. 

You can also deconstruct here if you like: 

```js
function Project({ image, title, link }) {
  return (
    <div>
      <img src={image} width="300" height="200" />
      <h3>{title}</h3>
      <a href={link}>Link to project</a>
    </div>
  ) 
}
```

Next, you need to assign values to each of the properties on the props object. Do this where instances of the Project component are created. 

Each property assigned to props is set as an attribute in the JSX declaration. 

In `PageContent.js` make following changes: 

```JS
function PageContent() {
  return (
    <div>
      <Project title="Tetris Dots" image="/images/kitten-0.jpeg" link="#" />
      <Project title="Zombie Server" image="/images/kitten-1.jpeg" link="#" />
      <Project title="Amazing Colors" image="/images/kitten-2.jpeg" link="#" />
      <Project title="Flip Toggle" image="/images/kitten-3.jpeg" link="#" />
      <Project title="121 Second St" image="/images/kitten-4.jpeg" link="#" />
      <Project title="Slide Shows" image="/images/kitten-5.jpeg" link="#" />
    </div>
  )
}
```

The attribute name needs to match the name of the key on the props object, `title`, `link`, and `image` in this case.  

You now have a single Project Component which you can use as often as you like, and each instance can display any title, image, and link url. This is the power of props. Use Props to configure your components. 

> Assign props as key value pairs defined in JSX like attributes in HTML. For example: `<MyComp message="Hello World" value={42} />`

> Get props inside a component from the props object which is passed as a parameter. 

```JS
function MyComp(props) {
  <div>
    <h1>{props.message}</h1> // Hello World
    <p>{props.value}</p> // 42
  </div>
}
```

> JS expression inside JSX must be placed in the `{}`. For example: `<PI value={22/7} />`

## Step 11: Thinking in components

**Think of the page you created**. It is built from Compoents. The Components are like Lego bricks, you can mix and match and reuse them to build a larger structure/system. 

When you edit your project you need only be concerned with the one component or the interaction between two components. In other words you'll often only be concerned with one or two components at a time while you work. 

In this page `App` is the top level component. It displays the `PageHeader` and `PageContent` components. The `PageContent` Component displays a list of `Project` components. 

To make changes to your project you'll need to think about which component is responsible for the area that you want to edit. You'll make the changes in the file that defines that component. 

It would be really nice if the projects were arranged in a grid. Do this by adding styles to the `PageContent` component. Remember `PageContent` component displays the `Project` components.

Add a new file: 

`src/PageContent.css`

Add the following code: 

```CSS
.PageContent {
  width: 960px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2em;
}
```

Import this stylesheet into the `PageContent` component. 

`import './PageContent.css'`

Then add the class name: 

```JS
function PageContent() {
  return (
    <div className="PageContent">
      ...
```

> React is a library for creating user interfaces. Components represent UI elements. Understanding your React projects is about understanding which component is responsible for which part of the UI.

## Step 12: Thinking in Components part 2

**Style the Project component**. The `Project` components could use some work. Add a style sheet and some styles to it. 

Follow these steps on your own. 

- Make a new stylesheet
  - Create a new CSS file in the src directory
- Import the stylesheet
  - import the new CSS file into `Project.js`
- Add some styles
  - Add some styles to the stylesheet
- Add some class names
  - Add a class name to elements in the Project component that you can target with your styles

## Step 13: Making New Components

**Your page needs a footer**. Add a Footer Component. Do this on your own following the steps used previously. Keep the footer simple for now. Keep the content simple in the footer for now. Imagine it only needs to display your name and copyright with the year: 

> Mitchell Hudson copyright 2019

- Make a new file for the new Component
- Define the footer in this file 
  - Remember to export the footer as default
- Import the Footer Component into `App` and render it

Style your Footer

- Add a class name to elements in Footer
- Make a new file for your footer css
- Add styles to this file and style elements in Footer
- Import the Footer Styles 

## Stretch Challenges 

Try these challenges

- Display the year in the footer by getting the year via JS using the Date Object
- Add a Like Count to each project. This will be a prop that is a number. 
- Display the Like count in the Project Component. 
- 



