# Moviefy

**Scenario:**

- Congratulations! You just got hired at a new firm. Your first assignment on the job is to create the initial version of an app that rates movies. As the firm grows, more iOS developers will join the team, so you've been asked to make the project easy to understand and scalable.

**Your mission:**

Using what you’ve learned so far about iOS networking, your assignment is to:
- Create a networking layer that will make the code scalable while adhering to MVC

## Step 1 - Getting to know the API and getting our keys

You will use [The Movie DB (TMDb)](https://themoviedb.org) API. Go to their site and create a free developer account. You will need to request an API Key, do it [here](https://developers.themoviedb.org).

Once you get the approval for the account, copy the value for the **v4 key**, this is the one you'll use in the project.

## Step 2 - Getting to know the current state of the project

[Starter Code to download](https://github.com/amelinagzz/moviefy-starter)

![folder](folder.png)

## Step 3 - The API client

Create a new folder and call it **Networking**. Every new file from now on should be moved here.

Create a new file and call it **APIClient**. Your API Client will own the `URLSession` and will be created using a provided `URLSessionConfiguration`.

```swift
struct APIClient {
    private let session: URLSession

    init(configuration: URLSessionConfiguration) {
        session = URLSession(configuration: configuration)
    }
}
```

That will be the basic structure of a reusable API client, and you can now create a specific version of this for Moviefy.

Create a new file and call it **MovieDB**.

```swift
struct MovieDB { // logic specific to the TMDB API
    public static let baseURL = URL(string: "https://api.themoviedb.org/3/")!
    public static var api: APIClient = {
        let configuration = URLSessionConfiguration.default
        let apiKey = "YOUR_API_KEY"
        configuration.httpAdditionalHeaders = [
            "Authorization": "Bearer \(apiKey)"
        ]
        return APIClient(configuration: configuration)
    }()
}
```

## Step 4 - Modeling the response

Before sending requests, you'll model the response data for the endpoint that returns featured movies. It looks like this:

```swift
{
    "page": 1,
    "total_pages": 12,
    "results": [
        {
            "id": ".........",
            "title": "Joker",
            "poster_path": "images/....../poster.jpg",
            "release_date": "2019-09-01"
        },
        { ... }
    ]
}
```

We know that we want to use the Codable protocol. The configuration to decode the model should be part of the model itself. You'll create a new type to show this.

Create a new file and name it **Model**. Put it in the Model folder. These are the contents:

```swift
public protocol Model : Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

public extension Model {
    static var decoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return decoder
    }

    static var encoder: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        return encoder
    }
}
```

This provides us a common protocol that all of our response models can implement

Now locate the file **Movie**. Make sure these are the contents:

```swift
struct Movie: Model, Hashable {
    let id: Int
    let title: String
    let posterPath: String
    let releaseDate: String
}
```

Notice how the struct now uses the type *Model*.

Remember the JSON structure? It will give us paginated results. So let's create a type to handle that.

Create a new file and call it **PagedResults**. These are the contents:

```swift
struct PagedResults<T: Model>: Model {
    let page: Int
    let totalPages: Int
    let results: [T]
}

extension PagedResults {
    static var decoder: JSONDecoder { T.decoder }
}
```

Here we are using a generic type `PagedResults` that has a generic parameter `T`. `T` is constrained to be an implementation of Model, so we know it is decodable already.

The extension will ensure it is decoded with the right decoder (it could be a custom one for a given model).

## Step 5 - Creating a request builder

Create a new file in the Networking folder, and call it **RequestBuilder**.

Add all the types of requests we can make

```swift
public enum HTTPMethod: String {
    case get
    case post
    case put
    case delete
}
```

Let's add a protocol that will be responsible for creating `URLRequest` instances and that will hold all of the information necessary we need to build the request.

```swift
public protocol RequestBuilder {
    var method: HTTPMethod { get }
    var baseURL: URL { get }
    var path: String { get }
    var params: [URLQueryItem]? { get }
    var headers: [String: String] { get }

    func toURLRequest() -> URLRequest
}
```

We want to handle some default functionality with the same configuration. Add this extension that will serve for all GET requests without a body:

```swift
public extension RequestBuilder {
    func toURLRequest() -> URLRequest {
        var components = URLComponents(url: baseURL.appendingPathComponent(path), resolvingAgainstBaseURL: false)!
        components.queryItems = params
        let url = components.url!

        var request = URLRequest(url: url)
        request.allHTTPHeaderFields = headers
        request.httpMethod = method.rawValue.uppercased()
        return request
    }
}
```

And last, we create the struct that conforms to the protocol. It will have the method type, the url, parameters and header that will be sent.

```swift
struct BasicRequestBuilder: RequestBuilder {
    var method: HTTPMethod
    var baseURL: URL
    var path: String
    var params: [URLQueryItem]?
    var headers: [String: String] = [:]
}
```

We have enough pieces to build a request. Now we should model a type that can take a builder and a callback for when data gets back.

Create a new file and call it **Request**. These are the contents:

```swift
public struct Request {
    let builder: RequestBuilder
    let completion: (Result<Data, Error>) -> Void

    init(builder: RequestBuilder, completion: @escaping (Result<Data, Error>) -> Void) {
        self.builder = builder
        self.completion = completion
    }
}
```

It is using Swift's Result type to model a successful value or an error.

Add a convenience initializer that will make your code readable by giving a clean way of handling all of our custom types.

```swift
public static func basic(method: HTTPMethod = .get, baseURL: URL, path: String, params: [URLQueryItem]? = nil, completion: @escaping (Result<Data, Error>) -> Void) -> Request {
    let builder = BasicRequestBuilder(method: method, baseURL: baseURL, path: path, params: params)
    return Request(builder: builder, completion: completion)
}
```

## Step 6 - Sending the request

You can now model requests and their callbacks. But you are not sending any requests yet. Go back to the **APIClient**, here you will provide a single `send()` method for issuing requests.

```swift
public func send(request: Request) {
    let urlRequest = request.builder.toURLRequest()
    let task = session.dataTask(with: urlRequest) { data, response, error in
        let result: Result<Data, Error>
        if let error = error {
            result = .failure(error)
        } else {
            result = .success(data ?? Data())
        }
        DispatchQueue.main.async {
            request.completion(result)
        }
    }
    task.resume()
}
```

Here we are making use of all the code we added before in a much shorter way. Can you think about what happened to the decoding step, that we are not seeing in this `send`
method?

<!--
Our Request type leaves off the interpretation of the data that we expected to receive. This allows the networking callback to be concerned only with data and not carrying around a set of generic parameters for decoding.
-->

## Step 7 - Fetching trending movies

Go back to your **MovieDB** file where you will start writing requests that are specific to this API.

The first one will be for popular movies.

```swift
extension Request {
    static func popularMovies(completion: @escaping (Result<PagedResults<Movie>, Error>) -> Void) -> Request {
        Request.basic(baseURL: MovieDB.baseURL, path: "discover/movie", params: [
            URLQueryItem(name: "sort_by", value: "popularity.desc")
        ]) { result in
          //we need to take the result and decode the response JSON into our expected type
        }
    }
}
```

It will return a request and the completion handler states the type of response we expect to get: a paged result of movies.

We are not decoding yet. This step is something we'll do every time. Let's move this functionality to an extension.

```swift
public extension Result where Success == Data, Failure == Error {
    func decoding<M: Model>(_ model: M.Type, completion: @escaping (Result<M, Error>) -> Void) {
      // decode the JSON in the background and call the completion block on the main thread        
      DispatchQueue.global().async {
            //Result’s flatMap() method takes the successful case (if it was successful) and applies your block. You can return a new Result that contains a successful value or an error.
            let result = self.flatMap { data -> Result<M, Error> in
                do {
                    let decoder = M.decoder
                    let model = try decoder.decode(M.self, from: data)
                    return .success(model)
                } catch {
                    return .failure(error)
                }
            }
            DispatchQueue.main.async {
                completion(result)
            }
        }
    }
}
```

It's ok if the above is confusing. The idea is to write the complex code once here so you can use it in many places and have those be clean and easy to read and write. You can always go back to study the method later.

You can now call it in the `popularMovies` method.

```swift
result.decoding(PagedResults<Movie>.self, completion: completion)
```

This now reads as: *take the result, decode into this type (PagedResults<Movie>), then call this completion block.*


You are ready to get the featured movies with this code (place it inside the method `fetchPopular` in the main View Controller)

```swift
let api = MovieDB.api
api.send(request: .trendingMovies(completion: { result in
    switch result {
    case .success(let page):
      print(page.results)
      self.movies = page.results
      var basicSection = MovieSection()
      basicSection.numberOfItems = self.movies.count
      basicSection.items = page.results
      self.sections = [TitleSection(title: "Now Trending"), basicSection]
      self.setupCollectionView()
    case .failure(let error):  print(error)
    }
}))
```

## Step 8 - Displaying images

If you run the app now you'll see all the data in the console and the names and dates of the movies in the simulator. But no images so far.

There is a special endpoint to fetch the images, you can add it to the **MovieDB** file.

```swift
public static let baseImageURL = URL(string: "https://image.tmdb.org/t/p/w500")!
```

and then in the method that configures the cell:

```swift
let imageURL : URL?
let imageBase = MovieDB.baseImageURL
imageURL = imageBase.appendingPathComponent(movie.posterPath)
coverImg.kf.setImage(with: imageURL)
```

The app is using the library [Kingfisher](https://github.com/onevcat/Kingfisher). Check out their github and documentation, you can use it in your future projects, it works great and is maintained regularly.

If you run the app again. Now you should see the following:

![trending](trending.png)

Congratulations! 🎉 you are on your way to create more requests with your reusable networking layer.

## Step 9 - Now you try it.

Add a new section to the home page to display **Upcoming Movies**.

Endpoint [here](https://developers.themoviedb.org/3/movies/get-upcoming).

## Stretch Challenges

1. We can get the base URL for images by calling the /configuration endpoint first. Create a new request to fetch those URLs. You will need the following type.

```swift
struct MovieDBConfiguration : Model {
    struct Images : Model {
        let baseUrl: URL
        let secureBaseUrl: URL
        let backdropSizes: [String]
        let logoSizes: [String]
        let posterSizes: [String]
        let profileSizes: [String]
        let stillSizes: [String]
    }

    let images: Images
    static var current: MovieDBConfiguration?
}
```

Then your method will be something like this:

```swift
static func configuration(_ completion: @escaping (Result<MovieDBConfiguration, Error>) -> Void) -> Request {
    Request.basic(baseURL: MovieDB.baseURL, path: "configuration") { result in
        result.decoding(MovieDBConfiguration.self, completion: completion)
    }
}
```
