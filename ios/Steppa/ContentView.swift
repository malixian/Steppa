import SwiftUI

struct ContentView: View {
    var body: some View {
        WebView(startPage: "index")
            .ignoresSafeArea(.container, edges: .bottom)
    }
}

#Preview {
    ContentView()
}
