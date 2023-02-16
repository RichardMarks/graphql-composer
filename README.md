# graphql-composer

Compose a `.graphql` file from many `.graphql` files.

```
git clone https://github.com/RichardMarks/graphql-composer.git
cd graphql-composer
npm i
npm run build
```

You can now copy the src/main.js file anywhere you like and invoke it using `node path/to/main.js`

### Usage

```sh
node path/to/main.js <input-file> <output-file>
```

The `<input-file>` parameter specifies the root graphql file to process.

Any included files from that root will be included into the root, and the composed file written to `<output-file>`


### Tutorial

- Build graphql-composer
- Create a Project Directory
- Copy composer to Project
- Write the root graphql file
- Write the included graphql files
- Invoke composer

```sh
mkdir -p ~/projects/test-graphql-composer
cd graphql-composer
npm run build
cp src/main.js ~/projects/test-graphql-composer/composer.js
cd ~/projects/test-graphql-composer
mkdir -p graphql/modules
```

Create these graphql files

```sh
touch graphql/schema.graphql
touch graphql/modules/{user,post,query}.graphql
```

graphql/schema.graphql
```gql
# #include "modules/user.graphql"
# #include "modules/post.graphql"
# #include "modules/query.graphql"
```

graphql/modules/user.graphql
```gql
type User {
  id: ID!
  name: String
}
```

graphql/modules/post.graphql
```gql
type Post {
  id: ID!
  title: String
  body: String
  user: User!
}
```

graphql/modules/query.graphql
```gql
type Query {
  users: [User!]!
  posts: [Post!]!
  postsByUser(user: User): [Post!]!
  post(postId: ID!): Post
  user(userId: ID!): User
}
```

Let's compose these files into a file called `composed.graphql` in the `graphql` directory.

```sh
node compose.js graphql/schema.graphql graphql/composed.graphql
```

`composed.graphql` will contain the following:

```gql
type User {
  id: ID!
  name: String
}
type Post {
  id: ID!
  title: String
  body: String
  user: User!
}
type Query {
  users: [User!]!
  posts: [Post!]!
  postsByUser(user: User): [Post!]!
  post(postId: ID!): Post
  user(userId: ID!): User
}
```


