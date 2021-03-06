<!-- Run this slideshow via the following command: -->
<!-- reveal-md README.md -w -->


<!-- .slide: class="header" -->

# CoreData + Notifications

## [Slides](https://make-school-courses.github.io/MOB-2.1-Local-Persistence-in-iOS/Slides/Lesson13/README.html ':ignore')

<!-- > -->

## Learning Objectives

1. Use Code Data notifications to notify objects of changes in a managed object context.
1. Implement a visual indicator to users that an action was successful in an app.

<!-- > -->

## NSFetchedResultsController

- What is it?
- What is an advantage of using it?
- How does it work?

<!-- > -->

## Core Data framework

The Core Data framework exposes several APIs that let us implement the same behavior as the `NSFetchedResultsController` class.

If we do so, we'll be able to observe a managed object context and then notify the app when an event takes place.

<!-- > -->

## Notification Center

Uses the Observer pattern 👀

Every managed object context posts three types of notifications:

```swift
NSManagedObjectContextObjectsDidChange
NSManagedObjectContextWillSave
NSManagedObjectContextDidSave
```

<!-- > -->

## Why would we listen to these events?

Think about a use case of when it's useful to listen to these three notifications and what you can do when you get one.

Write your answer in the chat **but don't send it yet**.

<!-- > -->

## In Class Activity - Implementing CoreData's notifications

### Step 1

Get your project from the very first time we used Core Data in this course. The one where you can add/remove Friends from a list.

<!-- > -->

### Step 2

Find the lines of code where you are updating the table after each add/delete action and get rid of them.

<!-- > -->

### Step 3

Get the notification center instance in `viewDidLoad`

```swift
let notificationCenter = NotificationCenter.default
```

Here's how you would add the observer for changed in an object. Add it and also include the two other notifications.

```swift
notificationCenter.addObserver(self, selector: #selector(managedObjectContextObjectsDidChange), name: NSNotification.Name.NSManagedObjectContextObjectsDidChange, object: managedContext)
```

<!-- > -->

### Step 4

Add the function that will be triggered by the notification.

```swift
@objc func managedObjectContextObjectsDidChange(notification: Notification) {
    guard let userInfo = notification.userInfo else { return }

    //call your reload table view or equivalent function here

    if let inserts = userInfo[NSInsertedObjectsKey] as? Set<NSManagedObject>, !inserts.isEmpty {
        print("--- INSERTS ---")
        print(inserts)
        print("+++++++++++++++")
    }

    if let updates = userInfo[NSUpdatedObjectsKey] as? Set<NSManagedObject>, !updates.isEmpty {
        print("--- UPDATES ---")
        for update in updates {
            print(update.changedValues())
        }
        print("+++++++++++++++")
    }

    if let deletes = userInfo[NSDeletedObjectsKey] as? Set<NSManagedObject>, !deletes.isEmpty {
        print("--- DELETES ---")
        print(deletes)
        print("+++++++++++++++")
    }
}
```

<!-- > -->

### Step 5

Using the [Toast-Swift library](https://github.com/scalessec/Toast-Swift), add a visual indicator to give feedback to the user when:
-  a friend was successfully added to the list
-  a friend was successfully removed from the list

*Use the Swift Package manager if available*

<!-- > -->

## External resources

- [Cocoacasts - Observing a managed object context](https://cocoacasts.com/how-to-observe-a-managed-object-context/)
- [Example project](https://github.com/phimage/ObservingManagedObjectContext/tree/swift5)
- [CoreData Notifications - article](https://marcosantadev.com/core-data-notification-swift/#NSManagedObjectContextObjectsDidChange)
