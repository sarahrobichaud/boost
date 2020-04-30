//@format
import IModule from '../../interfaces/IModule';
import {serverQueues} from '../../index';

const Skip: IModule = {
  name: 'Skip Module',
  cmd: 'skip',
  execute: (props, args) => {
    const musicData = serverQueues.get(props.guild.id);
    if (!musicData) {
      return props.reply('No music playing');
    }

    const amountToSkip =
      args.length > 2 ? (!isNaN(parseInt(args[2])) ? parseInt(args[2]) : 1) : 1;

    console.log('Queue lenght before:', musicData.queue.length);

    //Test amountToSkip to offset the shift later.
    musicData.queue.splice(0, amountToSkip - 1);
    console.log('Queue length after:', musicData.queue.length);
    musicData.dispatcher.end('Skipped');
  },
};

export default Skip;
