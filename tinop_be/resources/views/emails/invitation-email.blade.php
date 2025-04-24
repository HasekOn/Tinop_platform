{{-- resources/views/emails/project-invitation.blade.php --}}

@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ config('app.name') }}
        @endcomponent
    @endslot

    # Project Invitation 🚀

    Hello!

    You have been invited to collaborate on the **{{ $project->name }}** project.

    **Project Owner:** {{ $project->creator->name }} ({{ $project->creator->email }})
    **Invitation Sent:** {{ now()->format('j. F Y H:i') }}

    @component('mail::button', ['url' => route('invitations.accept', ['token' => $token])])
        Accept Invitation
    @endcomponent

    {{-- Alternative text for email clients that don't render buttons --}}
    @component('mail::subcopy')
        To accept the invitation, click the following link:
        [{{ route('invitations.accept', ['token' => $token]) }}]({{ route('invitations.accept', ['token' => $token]) }})
    @endcomponent

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            **Important:** This invitation will expire in 7 days.
            Need help? Contact [{{ config('mail.support_email') }}](mailto:{{ config('mail.support_email') }})

            @if (!auth()->check())
                **Note:** You need to be logged in to accept this invitation. If you don't have an account yet, please register first.
            @endif

            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        @endcomponent
    @endslot
@endcomponent
