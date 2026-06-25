class PromiseQueue {
  constructor() {
    this.tail = Promise.resolve()
  }

  add(asyncFn) {
    this.tail = this.tail.then(asyncFn).catch(console.error)
    return this.tail
  }
}

const queue = new PromiseQueue()

export default queue
