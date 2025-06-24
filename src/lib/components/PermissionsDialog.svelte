<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import * as Dialog from '../components/ui/dialog';
    import Button from './ui/button/button.svelte';
    import Badge from './ui/badge/badge.svelte';
    import { Check } from 'lucide-svelte';
    import { page } from '$app/state';
    import { sendFormData } from '$lib/api/helpers';

    // let unsubscribe: Unsubscriber;

    let { users, permissions, open = $bindable() } = $props();
    
    let currentPermission: { users: any; id: string; };
    let permittedUsers = getPermittedUsers(permissions, 'deps', page.params.departmentId);
    
     console.log(permittedUsers);
    let selectedUsers = $state.raw(
         users.filter((user) => {
              return permittedUsers.find((pUserId: string) => {
                   return user.id === pUserId;
              });
         })
    );

    function selected(uid: string): boolean {
         return selectedUsers.findIndex((user) => user.id === uid) !== -1;
    }

    function select(user) {
         if (selected(user.id)) {
              selectedUsers = selectedUsers.filter((u) => u.id !== user.id);
         } else {
              selectedUsers = [...selectedUsers, user];
         }
    }

    function isTeamOrDepartment(pageParams) {
         if (pageParams.departmentId) {
              return 'department';
         } else if (pageParams.teamId) {
              return 'team';
         }

         return null;
    }

    function getPermittedUsers(permissions: any[], param: 'deps' | 'teams', recordId: string) {
        
        if (permissions.length === 0) {
              const e = new Error('No permissions found');
               console.error(e);

               return [];
          }

         currentPermission = permissions.find((permission) => {
              return permission[param] == recordId;
         });

         if (!currentPermission) {
              const e = new Error('No permission with this id found');
               console.error(e);

               return [];
          }

         return currentPermission.users;
    }

    function createPermission(permUsers: any[], id: string) {
          const data = new FormData();

          data.append("deps", isTeamOrDepartment(page.params) === 'department' ? id : "");
          
          data.append("teams", isTeamOrDepartment(page.params) === 'team' ? id : "");

          for (const userId of permUsers) {
               data.append('users', userId);
          }

          sendFormData('/users?/createPermission', data)
              .then((resp) => {
                   console.log(resp);
          }).catch((err) => {
                   console.error(err);
          });
    }

    function updatePermission(permissionId: string, permUsers: string[]) {
         if (!currentPermission) {
          console.log("No users found, creating new permission");
            createPermission(permUsers, page.params.departmentId || page.params.teamId);
            return;
         }

         const data = new FormData();

         data.append("permissionId", permissionId);

          console.log("Updating permission", permissionId);
         for (const userId of permUsers) {
              data.append('users', userId);
         }


         sendFormData('/users?/updatePermission', data)
              .then((resp) => {
                   console.log(resp);
          }).catch((err) => {
                   console.error(err);
          });
    }

</script>

<Dialog.Root bind:open>
    <Dialog.Content class="max-w-[50%]">
         <Dialog.Header>
              {@const T = isTeamOrDepartment(page.params)}
              <Dialog.Title
                   >Zugriff {#if T == 'department'}der Abteilung{:else if T == 'team'}des Teams{/if} bearbeiten</Dialog.Title
              >
              <Dialog.Description>
                   Wähle Benutzer aus, welche auf diese Seite zugreifen dürfen.
              </Dialog.Description>
         </Dialog.Header>
         <div class="">
              <div class="">
                   {#if users}
                        <div class="grid border rounded-lg">
                             {#each users as user, index}
                                  <button
                                       onclick={() => select(user)}
                                       class="p-3 w-full space-x-2 hover:bg-muted-background transition-all duration-200 flex items-center"
                                       class:border-t={index != 0}
                                  >
                                       {#if selected(user.id)}
                                            <div class="flex justify-center items-center w-5 h-5 border rounded-full">
                                                 <Check class="w-3 h-3" />
                                            </div>
                                       {:else}
                                            <div class="w-5 h-5 rounded-full border"></div>
                                       {/if}
                                       <div class="text-sm">{user.name}</div>
                                  </button>
                             {/each}
                        </div>
                   {/if}
              </div>
              <div class="mt-4">
                   <p class="text-sm font-medium">Ausgewählte Benutzer</p>
                   <div class=" mt-2 min-h-[50px]">
                        {#if selectedUsers.length > 0}
                             <div class="space-x-1">
                                  {#each selectedUsers as user, index}
                                       <Badge variant="outline">{user.name}</Badge>
                                  {/each}
                             </div>
                        {/if}
                   </div>
              </div>
         </div>
         <Dialog.Footer>
              <Button
                   disabled={selectedUsers.length === 0}
                   onclick={() => {
                        open = false;
                        updatePermission(
                             currentPermission?.id,
                             selectedUsers.map((user) => user.id)
                        );
                   }}>Fertig</Button
              >
         </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
