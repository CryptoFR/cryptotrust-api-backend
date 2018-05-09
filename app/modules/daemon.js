class Daemon {

    constructor () {
        this.tasks = [

        ];
    }

    launch () {
        this.tasks.forEach((task) => {
           setInterval(task.exec, task.delay);
        });
    }

};

module.exports = new Daemon();