import { loadTasks, saveTasks } from "./tasks.js";

const HELP = `שימוש:
  node todo.js add "טקסט"   הוספת משימה
  node todo.js list         הצגת כל המשימות
  node todo.js done <id>    סימון משימה כבוצעה
  node todo.js remove <id>  מחיקת משימה`;

const [command, arg] = process.argv.slice(2);
const tasks = await loadTasks();

function findTask(id) {
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) {
    console.error(`משימה ${id} לא נמצאה`);
    process.exit(1);
  }
  return task;
}

switch (command) {
  case "add": {
    if (!arg) {
      console.error('חסר טקסט למשימה: node todo.js add "..."');
      process.exit(1);
    }
    const id = Math.max(0, ...tasks.map((t) => t.id)) + 1;
    tasks.push({ id, text: arg, done: false });
    await saveTasks(tasks);
    console.log(`נוספה משימה ${id}: ${arg}`);
    break;
  }
  case "list":
    if (tasks.length === 0) console.log("אין משימות");
    for (const t of tasks) console.log(`${t.id}. [${t.done ? "x" : " "}] ${t.text}`);
    break;
  case "done": {
    const task = findTask(arg);
    task.done = true;
    await saveTasks(tasks);
    console.log(`משימה ${task.id} סומנה כבוצעה`);
    break;
  }
  case "remove": {
    const task = findTask(arg);
    await saveTasks(tasks.filter((t) => t !== task));
    console.log(`משימה ${task.id} נמחקה`);
    break;
  }
  default:
    console.log(HELP);
}
