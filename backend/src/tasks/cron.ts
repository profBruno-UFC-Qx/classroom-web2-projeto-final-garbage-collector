import cron from 'node-cron';
import { RideService } from '../services/RideService';

export const startCronJobs = () => {
  console.log('Verificando tarefas pendentes na inicialização...');
  RideService.autoFinishPastRides()
    .then(() => console.log('Verificação inicial concluída'))
    .catch(error => console.error('Erro na verificação inicial:', error));

  cron.schedule('0 0 * * *', async () => {
    console.log('Executando tarefa agendada: Finalizar caronas passadas...');
    try {
      await RideService.autoFinishPastRides();
    } 
    catch (error) {
      console.error('Erro ao executar autoFinishPastRides:', error);
    }
  });
  
  console.log('Cron Jobs iniciados.');
};