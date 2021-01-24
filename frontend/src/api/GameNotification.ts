import { User } from './User';

export enum NotificationType {
  SubmitCorrect = 'SUBMIT_CORRECT',
  SubmitIncorrect = 'SUBMIT_INCORRECT',
  TestCorrect = 'TEST_CORRECT',
  CodeStreak = 'CODE_STREAK',
  TimeLeft = 'TIME_LEFT',
}

export type GameNotification = {
  initiator: User,
  time: Date,
  notificationType: NotificationType,
  content?: string,
}
