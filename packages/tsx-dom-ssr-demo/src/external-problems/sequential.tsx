import { ComponentThis, createContext } from "tsx-dom-ssr";

// How to solve duplicate filtering problematic?

// Idea 1:
const SequentialContext = createContext({
    begin: () => Promise.resolve(),
    end: () => Promise.resolve(),
});
export async function SequentialComponent(this: ComponentThis) {
    const sequential = SequentialContext.for(this);
    await sequential.begin();
    try {
        // ...
    } finally {
        sequential.end();
    }
}

// Idea 2:
export async function SequentialComponent2(this: ComponentThis) {
    // await this.beginSequential();
    // try {
    //   // ...
    // } finally {
    //   this.endSequential();
    // }
}
