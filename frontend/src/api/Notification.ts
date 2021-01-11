import { User } from './User';

export enum NotificationType {
  SubmitCorrect = 'SUBMIT_CORRECT',
  SubmitIncorrect = 'SUBMIT_INCORRECT',
  TestCorrect = 'TEST_CORRECT',
  CodeStreak = 'CODE_STREAK',
  OneMinRemaining = 'ONE_MIN_REMAINING',
}

export type Notification = {
  initiator: User,
  time: Date,
  notificationType: NotificationType,
  content?: string,
}
