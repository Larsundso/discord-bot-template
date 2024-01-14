import ch from '../BaseClient/Util.js';

export default async (eventName: string, args: unknown[]) => {
 const event = (await ch.getEvents()).find((e) => e.endsWith(`${eventName}.js`));
 if (!event) return;

 (await import(event)).default(...args);
};
