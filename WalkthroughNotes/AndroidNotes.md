[Video link](https://www.youtube.com/watch?v=BCSlZIUj18Y&t=41s)

# Day 1

### Topics
1. Install
2. Build first app

MainActivity.kt // is the CONTROLLER / VIEW CONTROLLER, extends AppCompatActivity

activity_main.xml // layout of screen is the VIEW

onCreate method
setContentView(<layout_file>)

Folder => manifests
AndroidManifest.xml // info about project, like main entry point ie main intent

res folder contains following:
drawable => png, icons
layout => activity views
mipmap => app icons
values => global variables of project, colors, strings, themes

build.gradle // 

view files (eg activity_main.xml) can be edited via code/design/both

View components can be text view, button view, input field, checkbox, etc

```
val someComponent = findViewById<SomeViewComponent>(R.id.SOME_ID) // get a reference to view components

someComponent.setOnClickListener() // add a listener
someComponent.text.toString() // get text
someComponent.text = 'New text' // set text
someComponent.text.clear() // clear text

Toast.makeText(context, text, time).show() // show toast message

someComponent.visibility = VISIBLE

someComponent.setOnClickListener {
    val intent = new Intent(context, ActivityClass::class.java)
    intent.putExtra(key, value)
    startActivity(intent)
}

// in other activity
val value = intent.getStringExtra(key)
```

# Day 2

### Topics
1. Kotlin fundamentals
2. Activity lifecycle
3. Object oriented kotlin

Activity can be resumeed, paused, stopped, created, destroyed

java.lang.Object <- Context <- ContextWrapper <- ContextThemeWrapper <- Activity <- ComponentActivity <- FragmentActivity <- AppCompatActivity

# Day 3

### Topics
1. Shared preferences
2. BMI calculator
3. Audio and video

Android stores data for each application, is available even after app is closed

```
// declare
var sf: SharedPreferences
var editor: SharedPreferences.Editor

// initialize in onCreate()
sf = getSharedPreferences("file_name", MODE)
editor = sf.edit()

// set values
editor.apply {
    putString(key, value)
    putInt(key, value)
    commit()
}

// get values
sf.getString(key, value)
sf.getInt(key, value)
```

Android has MediaPlayer
```
var mediaPlayer: MediaPlayer
mediaPlayer = MediaPlayer.create(this, R.raw.MEDIA_NAME)
btn.setOnClickListener {
    mediaPlayer.start()
    mediaPlayer.pause()
    mediaPlayer?.stop() // safe call

    mediaPlayer.release() // release resources
    mediaPlayer = null 
}
```

SeekBar

```
var seekBar: SeekBar
seekBar = findViewById(R.id.SEEK_BAR_ID)
seekBar.max = mediaPlayer.duration
seekBar.progress = mediaPlayer.currentPosition // can update progress by something like setTimeout in JS
```

VideoView
```
val uri: URI = parse("android.resource://" + packageName + "/" + R.raw.VIDEO_NAME)
val videoView = findViewById(R.id.VIDEO_VIEW_ID)

val mediaController = MediaController(this)
mediaController.setAnchorView(videoView)

videoView.setMediaController(mediaController)
videoView.setVideoUri(uri)
videoView.requestFocus()
videoView.start()
```

# Day 4

### Topics
1. ViewModel and LiveData
2. Recycler View
3. Coroutines


Recycler view contains:
a. Adapter
b. ViewHolder
c. LayoutManager

Layout manager of 3 types:
1. Linear layout manager
2. Grid layout manager
3. Staggered layout manager

```
btn.setOnClickListener {
    CoroutineScope(Dispatchers.IO).launch {
        someThreadIntensiveWork()
    }
}

fun someThreadIntensiveWork() {
    hardWork() // on separate thread
    
    withContext(Dispatchers.Main) {
        accessOrUpdateUI() // only main thread can update UI, like below
        component.text = "Some text"
    }
}

// There is also GlobalScope but rarely used
```

Dispatchers type:
1. Dispatchers.Main // also called UI thread
2. Dispatchers.IO // for network, local db, files
3. Dispatchers.Default // for CPU intensive work
4. Dispatchers.Unconfirmed // 

Coroutine leaders:
1. launch() // not return anything
2. async // return a single value
3. produce // return a stream
4. runBlocking // blocks thread and returns value

Suspending Functions, mark function with suspend
Types:
1. withContext
2. withTimeout
3. withTimeoutOrNull
4. join
5. delay
6. await
7. supervisorScope
8. coroutineScope

viewModelScope is a CoroutineScope tied to a ViewModel

# Day 5

### Topics
1. Room CRUD app
2. View binding


SQLite is a lightweight, self-contained, serverless relational database engine that stores data in a single file.
It’s used across mobile, desktop, and embedded systems for fast, reliable local data storage
Whatsapp uses SQLite to store messages

Room is SQLite ORM

Database inspector

ViewBinding and DataBinding
To avoid writing findViewById

# Day 6

### Topics
1. Android Services
2. Networking with Retrofit
3. Notification Components

startService(intent) & stopService(intent) like startActivity(intent)

we can also broadcast and receive intents

# Day 7

### Topics
1. Fragments
2. Navigation components

Fragment lifecycle methods like activity lifecycle methods but extra methods

3 main parts of navigation component:
1. Navigation Graph
2. NavHostFragment
3. NavController

Add a nav_graph.xml in an activity
Then add fargments to nav_graph.xml
Then a nav link between them, with optional animation
You can send data between fragments too
