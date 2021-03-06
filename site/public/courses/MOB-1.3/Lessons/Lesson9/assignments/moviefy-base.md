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

# Step 3 - Modeling the response

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

We know that we want to use the Codable protocol.

Locate the file **Movie**. Complete the contents:

```swift
struct Movie {
    let id: Int
    let title: String
    let posterPath: String
    let releaseDate: String
}

extension Movie: Codable {

    enum MovieCodingKeys: String, CodingKey {
        case id
        case posterPath = "poster_path"
        case title
        case releaseDate = "release_date"
    }

    init(from decoder: Decoder) throws {
        let movieContainer = try decoder.container(keyedBy: MovieCodingKeys.self)
        id = try movieContainer.decode(Int.self, forKey: .id)
        posterPath = try movieContainer.decode(String.self, forKey: .posterPath)
        title = try movieContainer.decode(String.self, forKey: .title)
        releaseDate = try movieContainer.decode(String.self, forKey: .releaseDate)
    }
}
```

Remember the JSON structure? It will give us paginated results. So let's create a type to handle that. You can do it in the same Movie file.


```swift
struct MovieApiResponse {
    let page: Int
    let numberOfPages: Int
    let movies: [Movie]
}

extension MovieApiResponse: Codable {

    private enum MovieApiResponseCodingKeys: String, CodingKey {
        case page
        case numberOfPages = "total_pages"
        case movies = "results"
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: MovieApiResponseCodingKeys.self)
        page = try container.decode(Int.self, forKey: .page)
        numberOfPages = try container.decode(Int.self, forKey: .numberOfPages)
        movies = try container.decode([Movie].self, forKey: .movies)
    }
}
```

## Step 4 - The API client

Create a new folder and call it **Networking**. Every new file from now on should be moved here.

Create a new file and call it **APIClient**. Your API Client will own the `URLSession` and will be created using a default `URLSessionConfiguration`.

```swift
struct APIClient{
    static let shared = APIClient()
    let session = URLSession(configuration: .default)
}
```

That will the basic structure of a reusable API client.

Create a new file and call it **Request**. Here you will create the complete request.

```swift
struct Request {
    static let headers = [  
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    ]
}
```

At this point we are only including the parameters that we want to send in the header of our requests. We will complete this file later, but first we need to deal with possible errors and different options for endpoints.

## Step 5 - Network errors

Whenever there's an error in any step of the network call, we should be able to identify where it happened and as much information as possible.

Create a new class and call it **NetworkError**. Here you'll have an enum with all the possible errors.

```swift
public enum NetworkError: String, Error {
    case parametersNil = "Parameters were nil"
    case encodingFailed = "Parameter Encoding failed"
    case decodingFailed = "Unable to Decode data"
    case missingURL = "The URL is nil"
    case couldNotParse = "Unable to parse the JSON response"
    case noData = "Data is nil"
    case fragmentResponse = "Response's body has fragments"
    case authenticationError = "You must be authenticated"
    case badRequest = "Bad request"
    case pageNotFound = "Page not found"
    case failed = "Request failed"
    case serverError = "Server error"
    case noResponse = "No response"
    case success = "Success"


}
```

## Step 6 - HTTP Methods and Routes

Go back to Request.swift and add the following enums before the struct already there:

```swift
public enum HTTPMethod: String{  
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}
```

This enum represents all the available HTTP methods you will be able to use.


```swift
public enum Route: String{
    case movies = "discover/movie"
}
```

This enum represents all the available endpoints you will be able to use.


## Step 7 - Configuring the request

Inside the struct, create a new method that will configure the request with the endpoint, parameters, method and body if applicable.

```swift
static func configureRequest(from route: Route, with parameters: [String: Any], and method: HTTPMethod, contains body: Data?) throws -> URLRequest {

    guard let url = URL(string: "https://api.themoviedb.org/3/\(route.rawValue)") else { fatalError("Error while unwrapping url")}
    var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10.0)
    request.httpMethod = method.rawValue
    request.httpBody = body
    try configureParametersAndHeaders(parameters: parameters, headers: headers, request: &request)
    return request
}
```

Do you see already how are you using the error enum?

You are calling the method `configureParametersAndHeaders` that you didn't have yet. Add the following:

```swift
static func configureParametersAndHeaders(parameters: [String: Any]?,
                                              headers: [String: String]?,
                                              request: inout URLRequest) throws {
    do {
        if let headers = headers, let parameters = parameters {
            try Encoder.encodeParameters(for: &request, with: parameters)
            try Encoder.setHeaders(for: &request, with: headers)
        }
    } catch {
        throw NetworkError.encodingFailed
    }
}
```

Here you try to encode both the parameters and headers, before making the call.

Notice again how you are using the error enum.

But you don't have an encoder yet, let's take care of that.

## Step 8 - Encoder

Create a new file and call it **Encoder**

```swift
public struct Encoder {

    static func encodeParameters(for urlRequest: inout URLRequest, with parameters: [String: Any]) throws {
        guard let url = urlRequest.url else { throw NetworkError.missingURL }

        if var urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false), !parameters.isEmpty {
            urlComponents.queryItems = [URLQueryItem]()
            for (key,value) in parameters {
                let queryItem = URLQueryItem(name: key, value: "\(value)")
                urlComponents.queryItems?.append(queryItem)
            }
            urlRequest.url = urlComponents.url
        }
    }

    static func setHeaders(for urlRequest: inout URLRequest, with headers: [String: String]) throws {        
        for (key, value) in headers{
            urlRequest.setValue(value, forHTTPHeaderField: key)
        }
    }
}

```

Can you figure out why we use inout parameters?

## Step 9 - Handling the response

Create a new file and call it **Response**

```swift

enum Result<T> {
    case success(T)
    case failure(Error)
}

struct Response {

    static func handleResponse(for response: HTTPURLResponse?) -> Result<String>{

        guard let res = response else { return Result.failure(NetworkError.noResponse)}

        switch res.statusCode {
        case 200...299: return .success(NetworkError.success.rawValue)
        case 401: return .failure(NetworkError.authenticationError)
        case 400...499: return .failure(NetworkError.badRequest)
        case 500...599: return .failure(NetworkError.serverError)
        default: return .failure(NetworkError.failed)
        }
    }

}
```

It will have a functions to check for the status code and return error or success.

## Step 10 - Making the call

We can now go back to APIClient and finish making the call.

Inside the struct add:

```swift
let parameters = [
       "sort_by": "popularity.desc"
]
```

```swift
func getPopularMovies(_ completion: @escaping (Result<[Movie]>) -> ()) {
    do{
      // Creating the request
        let request = try Request.configureRequest(from: .movies, with: parameters, and: .get, contains: nil)
            session.dataTask(with: request) { (data, response, error) in

            if let response = response as? HTTPURLResponse, let data = data {

                let result = Response.handleResponse(for: response)
                switch result {
                case .success:
                    //Decode if successful
                    let result = try? JSONDecoder().decode(MovieApiResponse.self, from: data)
                    completion(Result.success(result!.movies))

                case .failure:
                    completion(Result.failure(NetworkError.decodingFailed))
                }
            }
        }.resume()
    }catch{
        completion(Result.failure(NetworkError.badRequest))
    }
}
```


You are ready to get the popular movies with this code (place it inside the method `fetchPopular` in the main View Controller)

```swift
APIClient.shared.getPopularMovies { (result) in
      switch result{
      case let .success(movies):
          DispatchQueue.main.async {
              self.movies = movies
              var basicSection = MovieSection()
              basicSection.numberOfItems = movies.count
              basicSection.items = movies
              self.sections.append(TitleSection(title: "Popular Movies"))
              self.sections.append(basicSection)
              self.setupCollectionView()
          }
      case let .failure(error):
          print(error)
      }
  }
```

## Step 11 - Displaying images

If you run the app now you'll see the names and dates of the movies in the simulator. But no images so far.

There is a special endpoint to fetch the images, you can add it to the **Request** file.

```swift
public static let baseImageURL = URL(string: "https://image.tmdb.org/t/p/w500")!
```

and then in the method that configures the cell:

```swift
let imageURL : URL?
let imageBase = Request.baseImageURL
imageURL = imageBase.appendingPathComponent(movie.posterPath)
coverImg.kf.setImage(with: imageURL)
```

The app is using the library [Kingfisher](https://github.com/onevcat/Kingfisher). Check out their github and documentation, you can use it in your future projects, it works great and is maintained regularly.

If you run the app again. Now you should see the following:

![trending](trending.png)

Congratulations! 🎉 you are on your way to create more requests with your reusable networking layer.

## Step 12 - Now you try it.

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
