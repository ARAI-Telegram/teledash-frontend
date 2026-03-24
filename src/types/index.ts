import * as API from "types/api";

export type GetChatsParams = API.paths["/chats"]["get"]["parameters"]["query"];
export type GetChatsResponse =
  API.paths["/chats"]["get"]["responses"]["200"]["content"]["application/json"];
export type Chat = API.components["schemas"]["ChatOut"];
export type ChatRef = API.components["schemas"]["ChatRef"];
export type ChatMetrics = API.components["schemas"]["ChatMetrics"];
export type ChatType = API.components["schemas"]["ChatType"];
export type PostAddChatBody =
  API.paths["/clients/{client_id}/add-chat"]["post"]["requestBody"]["content"]["application/json"];
export type ChatSortBy = API.components["schemas"]["ChatSortBy"];
export type GetChatsStatsParams =
  API.paths["/messages/stats"]["get"]["parameters"]["query"];
export type GetChatsStatsResponse = { [key: string]: [StatsEntry] };

export type GetMessagesParams =
  API.paths["/messages"]["get"]["parameters"]["query"];
export type GetMessagesResponse =
  API.paths["/messages"]["get"]["responses"]["200"]["content"]["application/json"];
export type Message = API.components["schemas"]["MessageOut"];
export type MessageForward = API.components["schemas"]["MessageForward"];
export type MessageRef = API.components["schemas"]["MessageRef"];
export type MessageAttachment = API.components["schemas"]["MessageAttachment"];
export type MessageAttachmentType =
  API.components["schemas"]["MessageMediaType"];
export type MessageAttachmentStorageRef =
  API.components["schemas"]["MessageAttachmentStorageRef"];
export type MessageServiceType =
  API.components["schemas"]["MessageServiceType"];
export type MessageServiceInfo =
  API.components["schemas"]["MessageServiceInfo"];
export type TranscriptionStatus =
  API.components["schemas"]["TranscriptionStatus"];
export type MessageEntity = API.components["schemas"]["MessageEntity"];
export type MessageSortBy = API.components["schemas"]["MessageSortBy"];
export type OrderEnum = API.components["schemas"]["OrderEnum"];
export type GetMessagesStatsParams =
  API.paths["/messages/stats"]["get"]["parameters"]["query"];
export type StatsEntry = API.components["schemas"]["StatsEntry"];
export type GetMessagesStatsResponse = { [key: string]: [StatsEntry] };
export type MessageSearchType = API.components["schemas"]["MessageSearchType"];

export type GetUsersParams = API.paths["/users"]["get"]["parameters"]["query"];
export type GetUsersResponse =
  API.paths["/users"]["get"]["responses"]["200"]["content"]["application/json"];
export type User = API.components["schemas"]["UserOut"];
export type UserRef = API.components["schemas"]["UserRef"];
export type UserMetrics = API.components["schemas"]["UserMetrics"];
export type UserSortBy = API.components["schemas"]["UserSortBy"];

export type ListClientsParams =
  API.paths["/clients"]["get"]["parameters"]["query"];
export type ListClientsResponse =
  API.paths["/clients"]["get"]["responses"]["200"]["content"]["application/json"];
export type ClientIn = API.components["schemas"]["ClientIn"];
export type Client = API.components["schemas"]["ClientOut"];
export type ClientOut = ListClientsResponse["data"][0];
export type ClientSortBy = API.components["schemas"]["ClientSortBy"];

export type PostCreateClientBody =
  API.paths["/clients"]["post"]["requestBody"]["content"]["application/json"];
export type PostCreateClientResponse =
  API.paths["/clients"]["post"]["responses"]["201"]["content"]["application/json"];
export type SentCode = PostCreateClientResponse["auth"];
export type PutCreateClientResponse =
  API.paths["/clients/{id}"]["put"]["responses"]["200"]["content"]["application/json"];
export type PutUpdateClientBody =
  API.paths["/clients/{id}"]["put"]["requestBody"]["content"]["application/json"];
export type PutUpdateClientResponse =
  API.paths["/clients/{id}"]["put"]["responses"]["200"]["content"]["application/json"];
export type PutVerifyPhoneCodeResponse =
  API.paths["/clients/{id}/verify-phone-code"]["put"]["responses"]["200"]["content"]["application/json"];
export type PutVerifyPasswordResponse =
  API.paths["/clients/{id}/verify-password"]["put"]["responses"]["200"]["content"]["application/json"];

export type Account = API.components["schemas"]["AccountRead"];
export type PaginatedAccounts = API.components["schemas"]["PaginatedAccounts"];
export type ListAccountsParams =
  API.paths["/accounts"]["get"]["parameters"]["query"];
export type BearerResponse = API.components["schemas"]["BearerResponse"];
export type AccountUpdate = API.components["schemas"]["AccountUpdate"];

export type SavedSearchesMessagesCountDict =
  API.paths["/saved-searches/count-unread-messages"]["get"]["responses"]["200"]["content"]["application/json"];
export type SavedSearch = API.components["schemas"]["SavedSearchOut"];
export type ListMessagesParams =
  API.components["schemas"]["ListMessagesParams"];

export type GlobalMetricsResponse =
  API.paths["/metrics"]["get"]["responses"]["200"]["content"]["application/json"];

export type FastApiError = API.components["schemas"]["ErrorModel"];

export type SortBy = ChatSortBy | MessageSortBy | UserSortBy | ClientSortBy;

// Labeling
export type MessageForLabeling =
  API.components["schemas"]["MessageForLabeling"];
export type LabeledDataIn = API.components["schemas"]["LabeledDataIn"];
export type LabeledDataOut = API.components["schemas"]["LabeledDataOut"];

// Evaluation
export type EvaluationResult = API.components["schemas"]["EvaluationResult"];
export type EvaluationMetrics = API.components["schemas"]["EvaluationMetrics"];
export type Recommendation = API.components["schemas"]["Recommendation"];
