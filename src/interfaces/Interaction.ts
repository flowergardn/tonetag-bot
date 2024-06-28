import type {
  APIGuildMember,
  APIMessageApplicationCommandInteractionData,
} from "discord-api-types/v10";

export default interface Interaction {
  data: APIMessageApplicationCommandInteractionData;
  member: APIGuildMember;
}
