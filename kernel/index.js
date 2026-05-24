import { schedInit, schedLoop } from "./sched.js";
import * as klog from "./log.js";

klog.out(klog.INFO, "Booting");

klog.out(klog.INFO, "Initialising scheduler");
schedInit();

klog.out(klog.INFO, "Starting scheduler loop");
while (true)
    schedLoop();
