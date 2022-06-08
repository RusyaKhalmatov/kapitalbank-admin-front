import {color} from "@/colors";

export const statusesValue = {
  ACCEPTED: "ACCEPTED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  WAITING: "WAITING",
  PENDING: "PENDING",
}

export const statusesText = {
  ACCEPTED: "Принято",
  SUCCESS: "Успешно",
  FAILED: "Отказано",
  WAITING: "К поддтверждению",
  PENDING: "На рассмотрении",
}

const statuses = [
  {
    value: statusesValue.PENDING, text: "На рассмотрении", color: color.YELLOW, disabled: true, icon: ""
  },
  {
    value: statusesValue.WAITING, text: "К подтверждению", color: color.ORANGE, disabled: true, icon: "mdi-exclamation-bold"
  },
  {
    value: statusesValue.ACCEPTED, text: "Принято", color: color.BLUE, disabled: true, icon: ""
  },
  {
    value: statusesValue.SUCCESS, text: "Успешно", color: color.GREEN, disabled: true, icon: "mdi-check-thick"
  },
  {
    value: statusesValue.FAILED, text: "Отказано", color: color.RED, disabled: true, icon: "mdi-delete"
  },
]

export default statuses;

